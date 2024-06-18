
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.106.1"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.0.1"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "2.13.2"
    }
  }
}

# Retrieve AKS cluster information
provider "azurerm" {
  features {}
}


data "azurerm_kubernetes_cluster" "cluster" {
  name                = "testy-quest"
  resource_group_name = "testy-quest_group"
}

provider "kubernetes" {
  host = data.azurerm_kubernetes_cluster.cluster.kube_config.0.host
  client_certificate     = base64decode(data.azurerm_kubernetes_cluster.cluster.kube_config.0.client_certificate)
  client_key             = base64decode(data.azurerm_kubernetes_cluster.cluster.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(data.azurerm_kubernetes_cluster.cluster.kube_config.0.cluster_ca_certificate)
}

provider "helm" {
  kubernetes {
    host                   = data.azurerm_kubernetes_cluster.cluster.kube_config.0.host
    client_certificate     = base64decode(data.azurerm_kubernetes_cluster.cluster.kube_config.0.client_certificate)
    client_key             = base64decode(data.azurerm_kubernetes_cluster.cluster.kube_config.0.client_key)
    cluster_ca_certificate = base64decode(data.azurerm_kubernetes_cluster.cluster.kube_config.0.cluster_ca_certificate)
  }
}


resource "kubernetes_namespace" "testy_quest_namespace" {
  metadata {
    name = "testy-quest"
  }
  lifecycle {
    create_before_destroy = true
  }
}

locals {
  promtail_config_content = file("${path.module}/promtailscrapejob.yaml")
  mongod_conf_content = file("${path.module}/mongod.conf")
}
resource "helm_release" "external_nginx" {
  name = "external"

  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  namespace        = "testy-quest"
  create_namespace = true
  version          = "4.8.0"

  values = [file("${path.module}/externalIngress/ingress.yaml")]
}

resource "kubernetes_manifest" "grafana_deployment" {
  manifest = {
    apiVersion = "apps/v1"
    kind       = "Deployment"
    metadata   = {
      name      = "grafana-deployment"
      namespace = "testy-quest"
    }
    spec       = {
      replicas = 1
      selector = {
        matchLabels = {
          app = "grafana"
        }
      }
      template = {
        metadata = {
          labels = {
            app = "grafana"
          }
        }
        spec     = {
          containers = [
            {
              name  = "grafana"
              image = "grafana/grafana:latest"
              ports = [
                {
                  containerPort = 3000
                }
              ]
            }
          ]
        }
      }
    }
  }
}

resource "kubernetes_manifest" "grafana_service" {
  manifest = {
    apiVersion = "v1"
    kind       = "Service"
    metadata   = {
      name      = "grafana-service"
      namespace = "testy-quest"
    }
    spec       = {
      selector = {
        app = "grafana"
      }
      ports    = [
        {
          protocol   = "TCP"
          port       = 80
          targetPort = 3000
        }
      ]
      
    }
  }
  depends_on = [kubernetes_manifest.grafana_deployment]
}

resource "kubernetes_manifest" "loki_deployment" {
  manifest = {
    apiVersion = "apps/v1"
    kind       = "Deployment"
    metadata   = {
      name      = "loki-deployment"
      namespace = "testy-quest"
    }
    spec       = {
      replicas = 1
      selector = {
        matchLabels = {
          app = "loki"
        }
      }
      template = {
        metadata = {
          labels = {
            app = "loki"
          }
        }
        spec     = {
          containers = [
            {
              name  = "loki"
              image = "grafana/loki:latest"
              ports = [
                {
                  containerPort = 3100
                }
              ]
            }
          ]
        }
      }
    }
  }
}

resource "kubernetes_manifest" "loki_service" {
  manifest = {
    apiVersion = "v1"
    kind       = "Service"
    metadata   = {
      name      = "loki-service"
      namespace = "testy-quest"
    }
    spec       = {
      selector = {
        app = "loki"
      }
      ports    = [
        {
          protocol   = "TCP"
          port       = 3100
          targetPort = 3100
        }
      ]
    }
  }
  depends_on = [kubernetes_manifest.loki_deployment]
}


resource "kubernetes_config_map" "promtail_config" {
  metadata {
    name      = "promtail-config"
    namespace = "testy-quest"
  }
  data = {
    "promtail.yaml" = local.promtail_config_content
  }
}


resource "kubernetes_manifest" "kafka_ui_deployment" {
  manifest = {
    apiVersion = "apps/v1"
    kind       = "Deployment"
    metadata   = {
      name      = "kafka-ui-deployment"
      namespace = "testy-quest"
    }
    spec       = {
      replicas = 1
      selector = {
        matchLabels = {
          app = "kafka-ui"
        }
      }
      template = {
        metadata = {
          labels = {
            app = "kafka-ui"
          }
        }
        spec     = {
          containers = [
            {
              name  = "kafka-ui"
              image = "provectuslabs/kafka-ui:latest"
              ports = [
                {
                  containerPort = 8080
                }
              ]
              env = [
                {
                  name  = "DYNAMIC_CONFIG_ENABLED"
                  value = "true"
                }
              ]
            }
          ]
        }
      }
    }
  }
  depends_on = [kubernetes_namespace.testy_quest_namespace]
}


resource "kubernetes_manifest" "kafka_ui_service" {
  manifest = {
    apiVersion = "v1"
    kind       = "Service"
    metadata   = {
      name      = "kafka-ui-service"
      namespace = "testy-quest"
    }
    spec       = {
      selector = {
        app = "kafka-ui"
      }
      ports    = [
        {
          protocol   = "TCP"
          port       = 80
          targetPort = 8080
        }
      ]
      
    }
  }
  depends_on = [kubernetes_manifest.kafka_ui_deployment]
}

resource "kubernetes_manifest" "kafka_data_pvc" {
  manifest = {
    apiVersion = "v1"
    kind       = "PersistentVolumeClaim"
    metadata   = {
      name      = "kafka-data-claim"
      namespace = "testy-quest"
    }
    spec       = {
      accessModes = ["ReadWriteOnce"]
      resources   = {
        requests = {
          storage = "1Gi" # Adjust the storage size as needed
        }
      }
    }
  }

  depends_on = [kubernetes_namespace.testy_quest_namespace]
}

resource "kubernetes_manifest" "kafka" {
  manifest = {
    apiVersion = "apps/v1"
    kind       = "StatefulSet"
    metadata   = {
      name      = "kafka"
      namespace = "testy-quest"
    }
    spec       = {
      replicas = 3
      serviceName = "kafka-svc"
      selector = {
        matchLabels = {
          app = "kafka"
        }
      }
      template = {
        metadata = {
          labels = {
            app = "kafka"
          }
        }
        spec = {
          containers = [
            {
              name  = "kafka-container"
              image = "doughgle/kafka-kraft"
              ports = [
                {
                  containerPort = 9092
                }
              ]
              env = [
                {
                  name  = "REPLICAS"
                  value = "3"
                },
                {
                  name  = "SERVICE"
                  value = "kafka-svc"
                },
                {
                  name  = "NAMESPACE"
                  value = "testy-quest"
                },
                {
                  name  = "SHARE_DIR"
                  value = "/mnt/kafka"
                },
                {
                  name  = "CLUSTER_ID"
                  value = "oh-sxaDRTcyAr6pFRbXyzA"
                },
                {
                  name  = "DEFAULT_REPLICATION_FACTOR"
                  value = "3"
                }
                
              ]
              volumeMounts = [
                {
                  name       = "kafka-data"
                  mountPath  = "/mnt/kafka"
                }
              ]
            }
          ]
          volumes = [
            {
              name = "kafka-data"
              persistentVolumeClaim = {
                claimName = "kafka-data-claim"
              }
            }
            
          ]
        }
      }
    }
  }
  depends_on = [kubernetes_namespace.testy_quest_namespace]
}

resource "kubernetes_manifest" "kafka_service" {
  manifest = {
    apiVersion = "v1"
    kind       = "Service"
    metadata   = {
      name      = "kafka-svc"
      namespace = "testy-quest"
    }
    spec       = {
      clusterIP = "None"
      ports = [
        {
          port       = 9092
          targetPort = 9092
          protocol   = "TCP"
        }
      ]
      selector = {
        app = "kafka"
      }
    }
  }
  depends_on = [kubernetes_manifest.kafka]
}
resource "kubernetes_service" "mongodb_service" {
  metadata {
    name      = "mongodb"
    namespace = "testy-quest"
  }
  spec {
    selector = {
      app = "mongodb"
    }
    port {
      name        = "mongodb"
      port        = 27017
      target_port = 27017
    }
  }
  depends_on = [kubernetes_manifest.mongodb]
}

resource "kubernetes_manifest" "mongodb" {
  manifest = {
    apiVersion = "apps/v1"
    kind       = "Deployment"
    metadata   = {
      name      = "mongodb"
      namespace = "testy-quest"
    }
    spec       = {
      replicas = 1
      selector = {
        matchLabels = {
          app = "mongodb"
        }
      }
      template = {
        metadata = {
          labels = {
            app = "mongodb"
          }
        }
        spec     = {
          containers = [
            {
              name  = "mongodb"
              image = "mongo:latest"
              ports = [
                {
                  containerPort = 27017
                }
              ]
              env = [
                {
                  name  = "MONGO_INITDB_ROOT_USERNAME"
                  value = "root"
                },
                {
                  name  = "MONGO_INITDB_ROOT_PASSWORD"
                  value = "password123"
                }
              ]
              
            }
          ]
        }
      }
    }
  }
  depends_on = [kubernetes_namespace.testy_quest_namespace]
}


resource "kubernetes_manifest" "express_service" {
  manifest = {
    apiVersion = "v1"
    kind       = "Service"
    metadata   = {
      name      = "express-service"
      namespace = "testy-quest"
    }
    spec       = {
      selector = {
        app = "express"
      }
      ports    = [
        {
          name       = "http"
          protocol   = "TCP"
          port       = 8081
          targetPort = 8081
        }
      ]
      type = "LoadBalancer"
    }
  }
  depends_on = [kubernetes_manifest.express]
}

resource "kubernetes_manifest" "express" {
  manifest = {
    apiVersion = "apps/v1"
    kind       = "Deployment"
    metadata   = {
      name      = "express"
      namespace = "testy-quest"
    }
    spec       = {
      replicas = 1
      selector = {
        matchLabels = {
          app = "express"
        }
      }
      template = {
        metadata = {
          labels = {
            app = "express"
          }
        }
        spec     = {
          containers = [
            {
              name  = "express"
              image = "mongo-express:latest"
              ports = [
                {
                  containerPort = 8081
                }
              ]
              env = [
                {
                  name  = "ME_CONFIG_MONGODB_ADMINUSERNAME"
                  value = "root"
                },
                {
                  name  = "ME_CONFIG_MONGODB_ADMINPASSWORD"
                  value = "password123"
                },
                {
                  name  = "ME_CONFIG_MONGODB_URL"
                  value = "mongodb://root:password123@mongodb:27017/"
                },
                {
                  name  = "ME_CONFIG_BASICAUTH"
                  value = "false"
                },
              ]
            }
          ]
        }
      }
    }
  }
  depends_on = [kubernetes_namespace.testy_quest_namespace]
}

variable "github_sha" {
  description = "The GitHub SHA to use for the Docker image tag"
  type        = string
}

resource "kubernetes_manifest" "exam_website_deployment" {
  manifest = {
    apiVersion = "apps/v1"
    kind       = "Deployment"
    metadata   = {
      name      = "exam-website-deployment"
      namespace = "testy-quest"
    }
    spec       = {
      replicas = 1
      selector = {
        matchLabels = {
          app = "exam-website"
        }
      }
      template = {
        metadata = {
          labels = {
            app = "exam-website"
          }
        }
        spec     = {
          containers = [
            {
              name  = "exam-website"
              image = "darkghostshade/testy-quest-front-end:${var.github_sha}"
              ports = [
                {
                  containerPort = 3000
                }
              ]
              env   = [
                {
                  name  = "WATCHPACK_POLLING"
                  value = "true"
                },
                {
                  name  = "APICONNECTION"
                  value = "https://test-managerapi-service"
                }
              ]
              resources = {
                limits = {
                  cpu    = "500m"  
                  memory = "1Gi" 
                }
                requests = {
                  cpu    = "200m"  
                  memory = "256Mi"
                }
              }
            }
          ]
        }
      }
    }
  }
  depends_on = [kubernetes_namespace.testy_quest_namespace]
}


resource "kubernetes_manifest" "exam_website_service" {
  manifest = {
    apiVersion = "v1"
    kind       = "Service"
    metadata   = {
      name      = "exam-website-service"
      namespace = "testy-quest"
    }
    spec       = {
      selector = {
        app = "exam-website"
      }
      ports    = [
        {
          protocol   = "TCP"
          port       = 80
          targetPort = 3000
        }
      ]
    }
  }
  depends_on = [kubernetes_manifest.exam_website_deployment]
}

variable "firebase_config" {
  description = "Firebase configuration JSON"
  type        = string
  sensitive   = true
}

resource "kubernetes_secret" "firebase_config" {
  metadata {
    name      = "firebase-config"
    namespace = "testy-quest"
  }

  data = {
    firebaseconfig_json = var.firebase_config
  }
}

resource "kubernetes_manifest" "answer_managerapi_deployment" {
  manifest = {
    apiVersion = "apps/v1"
    kind       = "Deployment"
    metadata   = {
      name      = "answer-managerapi-deployment"
      namespace = "testy-quest"
    }
    spec       = {
      replicas = 1
      selector = {
        matchLabels = {
          app = "answer-managerapi"
        }
      }
      template = {
        metadata = {
          labels = {
            app = "answer-managerapi"
          }
        }
        spec = {
          containers = [
            {
              name            = "answer-managerapi-container"
              image           = "darkghostshade/answer-manager-api:latest"
              imagePullPolicy = "Always"
              ports           = [
                { containerPort = 80 }
                
              ]
              resources       = {
                requests = {
                  cpu    = "100m" 
                  memory = "128Mi"
                }
                limits = {
                  cpu    = "600m" 
                  memory = "500Mi"
                }
              }
              env = [
                {
                  name = "FIREBASE_CONFIG"
                  valueFrom = {
                    secretKeyRef = {
                      name = "firebase-config"
                      key  = "firebaseconfig_json"
                    }
                  }
                },
                {
                  name  = "JwtSecret"
                  value = "Rx92dmN9Mk6U5JqYi8AIhbWUBAkZgGmqXI0UGa6+tJ7P2LgEfMi+AiDXaXJB7iKMyZ3hf9BiLmIg/Q0Iv20DjcpCth+0zyvkC3CDtO9diF5J+q/gIzPm79/V9oUI6TUKcygKInVvynJDneJ4nlFp+TJ3heiOqtT6f0WSovtzgtIZrvGmFD/XG9D2SyH0tzUXPN3JpmkXTTkED3kqXHRXuhJc1AgaWGxc+sBQUSsTnr3PEZGTjK8RIQ0uFdlm22oJg7Xa6RG/K0bcs/LANUrN1GNZutlUfrLNOZuhfUizab0vPk9JnBw+6k6vfXdNi6woCZTdD0eIorlJonFxIK4LP7a3xAyvD/F1ZYxHlSX8SzdjpPAMXmvkH9kuHiLmXGRmU+vGGryaocsfyy5pSJ9pJTxK4bb+v60N8hJJji3mvxHkyNP5sfGs7HDwGR4QNNiB+ak7ZVhG8xxyAlrZrU2S9qrSWMYcQgY+wk5VpFgtOyjBxdjrxZYkqCHOq+gKIEUd8c2VFScvoPaM2uvHPFcRe9aeMXNG0n7v6AeAjhCs+8zInnVXj4NUahXvGoYe3PhVJYyXjlbSxitBog4KBdCyVr+i7g6XSYTR264V/BRd9I9m3a81l0mc7WpSdPhWoDrYPeNzCdEQ0n1dzGUCsFF8hbBuEijPszeDsKh+1iNLGnR53abwV4m1OCVCjlogIjraWoztZIdWqa+OJ8rz8c4vkth6amAfsVT8R269XSdEcnEpK18MuFQLccbax4V6pqmgUFhLwuZL6QnMfrtO/3hIJvDj8pVMPr2GkuYT8ndISsQ="
                },
                {
                  name  = "WATCHPACK_POLLING"
                  value = "true"
                }
               
              ]
              volumeMounts = [
                {
                  name      = "firebase-config-volume"
                  mountPath = "/etc/config"
                  subPath   = "firebaseconfig.json"
                }
              ]
            }
          ]
          volumes = [
            {
              name = "firebase-config-volume"
              secret = {
                secretName = "firebase-config"
              }
            }
          ]
        }
      }
    }
  }
  depends_on = [kubernetes_namespace.testy_quest_namespace]
}

resource "kubernetes_manifest" "answer_managerapi_service" {
  manifest = {
    apiVersion = "v1"
    kind       = "Service"
    metadata   = {
      name      = "answer-managerapi-service"
      namespace = "testy-quest"
    }
    spec       = {
      selector = {
        app = "answer-managerapi"
      }
      ports    = [
        {
          name       = "http"
          protocol   = "TCP"
          port       = 80
          targetPort = 8080
        }
      ]
    }
  }
  depends_on = [kubernetes_manifest.answer_managerapi_deployment]
}

resource "kubernetes_manifest" "answer_managerapi_hpa" {
  manifest = {
    apiVersion = "autoscaling/v2"
    kind       = "HorizontalPodAutoscaler"
    metadata   = {
      name      = "answer-managerapi-hpa"
      namespace = "testy-quest"
    }
    spec       = {
      scaleTargetRef = {
        apiVersion = "apps/v1"
        kind       = "Deployment"
        name       = "answer-managerapi-deployment"
      }
      minReplicas    = 1
      maxReplicas    = 20
      metrics        = [
        {
          type    = "Resource"
          resource = {
            name  = "cpu"
            target = {
              type              = "Utilization"
              averageUtilization = 70
            }
          }
        }
      ]
    }
  }
  depends_on = [kubernetes_namespace.testy_quest_namespace, kubernetes_manifest.answer_managerapi_deployment]
}

resource "kubernetes_manifest" "prometheus_deployment" {
  manifest = {
    apiVersion = "apps/v1"
    kind       = "Deployment"
    metadata   = {
      name      = "prometheus"
      namespace = "testy-quest"
    }
    spec       = {
      replicas = 1
      selector = {
        matchLabels = {
          app = "prometheus"
        }
      }
      template = {
        metadata = {
          labels = {
            app = "prometheus"
          }
        }
        spec     = {
          containers = [
            {
              name  = "prometheus"
              image = "prom/prometheus:v2.28.1"
              ports = [
                {
                  containerPort = 9090
                }
              ]
            }
          ]
        }
      }
    }
  }
}

resource "kubernetes_manifest" "prometheus_service" {
  manifest = {
    apiVersion = "v1"
    kind       = "Service"
    metadata   = {
      name      = "prometheus-service"
      namespace = "testy-quest"
    }
    spec       = {
      selector = {
        app = "prometheus"
      }
      ports    = [
        {
          protocol   = "TCP"
          port       = 80
          targetPort = 9090
        }
      ]
    }
  }
  depends_on = [kubernetes_manifest.prometheus_deployment]
}


resource "kubernetes_manifest" "question_managerapi_deployment" {
  manifest = {
    apiVersion = "apps/v1"
    kind       = "Deployment"
    metadata   = {
      name      = "question-managerapi-deployment"
      namespace = "testy-quest"
    }
    spec       = {
      replicas = 1
      selector = {
        matchLabels = {
          app = "question-managerapi"
        }
      }
      template = {
        metadata = {
          labels = {
            app = "question-managerapi"
          }
        }
        spec = {
          containers = [
            {
              name            = "question-managerapi-container"
              image           = "darkghostshade/question-manager-api:latest"
              imagePullPolicy = "Always"
              ports           = [
                { containerPort = 80 }
                
              ]
              resources       = {
                requests = {
                  cpu    = "100m" # CPU request
                  memory = "128Mi"
                }
                limits = {
                  cpu    = "400m" # CPU limit (1 core)
                  memory = "256Mi"
                }
              }
              env = [
                {
                  name = "DatabaseConnection"
                  value = "mongodb://root:password123@mongodb:27017/"
                },
                {
                  name = "FIREBASE_CONFIG"
                  valueFrom = {
                    secretKeyRef = {
                      name = "firebase-config"
                      key  = "firebaseconfig_json"
                    }
                  }
                }
              ]
              volumeMounts = [
                {
                  name      = "firebase-config-volume"
                  mountPath = "/etc/config"
                  subPath   = "firebaseconfig.json"
                }
              ]
            }
            
          ]
          volumes = [
            {
              name = "firebase-config-volume"
              secret = {
                secretName = "firebase-config"
              }
            }
          ]
        }
        
      }
    }
  }
  depends_on = [kubernetes_namespace.testy_quest_namespace,]
}

resource "kubernetes_manifest" "question_managerapi_service" {
  manifest = {
    apiVersion = "v1"
    kind       = "Service"
    metadata   = {
      name      = "question-managerapi-service"
      namespace = "testy-quest"
    }
    spec       = {
      selector = {
        app = "question-managerapi"
      }
      ports    = [
        {
          name       = "http"
          protocol   = "TCP"
          port       = 80
          targetPort = 8080
        }
      ]
    }
  }
  depends_on = [kubernetes_manifest.answer_managerapi_deployment,kubernetes_manifest.kafka_service,kubernetes_manifest.kafka]

  
}

resource "kubernetes_manifest" "question_managerapi_hpa" {
  manifest = {
    apiVersion = "autoscaling/v2"
    kind       = "HorizontalPodAutoscaler"
    metadata   = {
      name      = "question-managerapi-hpa"
      namespace = "testy-quest"
    }
    spec       = {
      scaleTargetRef = {
        apiVersion = "apps/v1"
        kind       = "Deployment"
        name       = "question-managerapi-deployment"
      }
      minReplicas    = 1
      maxReplicas    = 4
      metrics        = [
        {
          type    = "Resource"
          resource = {
            name  = "cpu"
            target = {
              type              = "Utilization"
              averageUtilization = 80
            }
          }
        }
      ]
    }
  }
  depends_on = [kubernetes_namespace.testy_quest_namespace, kubernetes_manifest.question_managerapi_deployment]
}

resource "kubernetes_manifest" "testy_quest_ingress" {
  manifest = {
    apiVersion = "networking.k8s.io/v1"
    kind       = "Ingress"
    metadata   = {
      name      = "testy-quest-ingress"
      namespace = "testy-quest"
      # annotations = {
      #   "nginx.ingress.kubernetes.io/limit-rps" = "10"
      #   "nginx.ingress.kubernetes.io/limit-connections" ="1"
      # }
    }
    spec       = {
      ingressClassName = "external-nginx"
      rules = [
        {
          host = "api.testy-quest.nl"
          http = {
            paths = [
              {
                path     = "/"
                pathType = "Prefix"
                backend  = {
                  service = {
                    name = "answer-managerapi-service"
                    port = {
                      number = 8080
                    }
                  }
                }
              }
            ]
          }
        },
        {
          host = "api.question.testy-quest.nl"
          http = {
            paths = [
              {
                path     = "/"
                pathType = "Prefix"
                backend  = {
                  service = {
                    name = "question-managerapi-service"
                    port = {
                      number = 8080
                    }
                  }
                }
              }
            ]
          }
        },
        {
          host = "website.testy-quest.nl"
          http = {
            paths = [
              {
                path     = "/"
                pathType = "Prefix"
                backend  = {
                  service = {
                    name = "exam-website-service"
                    port = {
                      number = 3000
                    }
                  }
                }
              }
            ]
          }
        },
        {
          host = "kafka-ui.testy-quest.nl"
          http = {
            paths = [
              {
                path     = "/"
                pathType = "Prefix"
                backend  = {
                  service = {
                    name = "kafka-ui-service"
                    port = {
                      number = 8080
                    }
                  }
                }
              }
            ]
          }
        },
        {
          host = "express.testy-quest.nl"
          http = {
            paths = [
              {
                path     = "/"
                pathType = "Prefix"
                backend  = {
                  service = {
                    name = "express-service"
                    port = {
                      number = 8081
                    }
                  }
                }
              }
            ]
          }
        },
        {
          host = "grafana.testy-quest.nl"
          http = {
            paths = [
              {
                path     = "/"
                pathType = "Prefix"
                backend  = {
                  service = {
                    name = "grafana-service"
                    port = {
                      number = 3000
                    }
                  }
                }
              }
            ]
          }
        }
      ]
    }
  }
}

resource "kubernetes_manifest" "promtail" {
  manifest = {
    apiVersion = "apps/v1"
    kind       = "DaemonSet"
    metadata   = {
      name      = "promtail"
      namespace = "testy-quest"
    }
    spec       = {
      selector = {
        matchLabels = {
          app = "promtail"
        }
      }
      template = {
        metadata = {
          labels = {
            app = "promtail"
          }
        }
        spec = {
          containers = [
            {
              name  = "promtail"
              image = "grafana/promtail:latest"
              args = [
                "-config.file=/etc/promtail/promtail.yaml"
              ]
              volumeMounts = [
                {
                  name       = "config"
                  mountPath  = "/etc/promtail"
                }
              ]
            }
          ]
          volumes = [
            {
              name = "config"
              configMap = {
                name = "promtail-config"
              }
            }
          ]
        }
      }
    }
  }
  depends_on = [kubernetes_namespace.testy_quest_namespace,kubernetes_manifest.kafka]

  provisioner "local-exec" {
    command = <<EOF
      kubectl wait --for=condition=Ready -n testy-quest pod/kafka-0 --timeout=600s
    EOF
  }
  
}







