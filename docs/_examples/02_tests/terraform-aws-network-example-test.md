---
layout: collection-browser-doc
title: Terraform AWS Network example test
category: tests
excerpt: >-
  The basic test written in GoLang.
tags: ["example"]
image: /assets/img/logos/aws-logo.png
order: 125
nav_title: Examples
nav_title_link: /examples/
---

Full source code can be found here: [terraform_aws_network_example_test.go](https://github.com/gruntwork-io/terratest/blob/master/test/terraform_aws_network_example_test.go).

Check out the corresponding example: [Terraform AWS Network Example]({{site.baseurl}}/examples/code-examples/terraform-aws-network-example/).

## Source code

```go
package test

import (
	"testing"

	"github.com/gruntwork-io/terratest/modules/aws"
	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// An example of how to test the Terraform module in examples/terraform-aws-network-example using Terratest.
func TestTerraformAwsNetworkExample(t *testing.T) {
	t.Parallel()

	// Pick a random AWS region to test in. This helps ensure your code works in all regions.
	awsRegion := aws.GetRandomStableRegion(t, nil, nil)

	// Give the VPC and the subnets correct CIDRs
	vpcCidr := "10.10.0.0/16"
	privateSubnetCidr := "10.10.1.0/24"
	publicSubnetCidr := "10.10.2.0/24"

	terraformOptions := &terraform.Options{
		// The path to where our Terraform code is located
		TerraformDir: "../examples/terraform-aws-network-example",

		// Variables to pass to our Terraform code using -var options
		Vars: map[string]interface{}{
			"main_vpc_cidr":       vpcCidr,
			"private_subnet_cidr": privateSubnetCidr,
			"public_subnet_cidr":  publicSubnetCidr,
			"aws_region":          awsRegion,
		},
	}

	// At the end of the test, run `terraform destroy` to clean up any resources that were created
	defer terraform.Destroy(t, terraformOptions)

	// This will run `terraform init` and `terraform apply` and fail the test if there are any errors
	terraform.InitAndApply(t, terraformOptions)

	// Run `terraform output` to get the value of an output variable
	publicSubnetId := terraform.Output(t, terraformOptions, "public_subnet_id")
	privateSubnetId := terraform.Output(t, terraformOptions, "private_subnet_id")
	vpcId := terraform.Output(t, terraformOptions, "main_vpc_id")

	subnets := aws.GetSubnetsForVpc(t, vpcId, awsRegion)

	require.Equal(t, 2, len(subnets))
	// Verify if the network that is supposed to be public is really public
	assert.True(t, aws.IsPublicSubnet(t, publicSubnetId, awsRegion))
	// Verify if the network that is supposed to be private is really private
	assert.False(t, aws.IsPublicSubnet(t, privateSubnetId, awsRegion))
}
```
