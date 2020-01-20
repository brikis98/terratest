---
layout: collection-browser-doc
title: Kubernetes Basic Example
category: code-examples
excerpt: >-
  A minimal Kubernetes resource that deploys an addressable nginx instance.
tags: ["kubernetes", "example", "nginx"]
image: /assets/img/logos/kubernetes-logo.png
order: 107
nav_title: Examples
nav_title_link: /examples/
---

This folder contains a minimal Kubernetes resource config file to demonstrate how you can use Terratest to write
automated tests for Kubernetes.

This resource file deploys an nginx container as a single pod deployment with a node port service attached to it.

See the corresponding terratest code for an example of how to test this resource config:
- [kubernetes_basic_example_test.go]({{site.baseurl}}/examples/tests/kubernetes-basic-example-test/) for the most basic verification
- [kubernetes_basic_example_service_check_test.go]({{site.baseurl}}/examples/tests/kubernetes-basic-example-service-check-test/) for a more
  advanced version of checking the service.


## Deploying the Kubernetes resource

1. Setup a Kubernetes cluster. We recommend using a local version:
    - [minikube](https://github.com/kubernetes/minikube)
    - [Kubernetes on Docker For Mac](https://docs.docker.com/docker-for-mac/kubernetes/)
    - [Kubernetes on Docker For Windows](https://docs.docker.com/docker-for-windows/kubernetes/)

1. Install and setup [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) to talk to the deployed
   Kubernetes cluster.
1. Run `kubectl apply -f nginx-deployment.yml`


## Running automated tests against this Kubernetes deployment

1. Setup a Kubernetes cluster. We recommend using a local version:
    - [minikube](https://github.com/kubernetes/minikube)
    - [Kubernetes on Docker For Mac](https://docs.docker.com/docker-for-mac/kubernetes/)
    - [Kubernetes on Docker For Windows](https://docs.docker.com/docker-for-windows/kubernetes/)

1. Install and setup [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) to talk to the deployed
   Kubernetes cluster.
1. Install and setup [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
1. Install [Golang](https://golang.org/) and make sure this code is checked out into your `GOPATH`.
1. `cd test`
1. `dep ensure`
1. `go test -v -tags kubernetes -run TestKubernetesBasicExample`
1. You can also run `TestKubernetesBasicExampleServiceCheck`
