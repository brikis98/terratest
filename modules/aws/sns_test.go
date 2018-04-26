package aws

import (
	"testing"
	"github.com/gruntwork-io/terratest/modules/random"
	"fmt"
	"github.com/aws/aws-sdk-go/service/sns"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/stretchr/testify/assert"
	"strings"
)

func TestCreateAndDeleteSnsTopic(t *testing.T) {
	t.Parallel()

	region := GetRandomRegion(t, nil, nil)
	uniqueId := random.UniqueId()
	name := fmt.Sprintf("test-sns-topic-%s", uniqueId)

	arn := CreateSnsTopic(t, region, name)
	defer deleteTopic(t, region, arn)

	assert.True(t, snsTopicExists(t, region, arn))
}

func snsTopicExists(t *testing.T, region string, arn string) bool {
	snsClient, err := NewSnsClient(region)
	if err != nil {
		t.Fatal(err)
	}

	input := sns.GetTopicAttributesInput{TopicArn: aws.String(arn)}

	if _, err := snsClient.GetTopicAttributes(&input); err != nil {
		if strings.Contains(err.Error(), "NotFound") {
			return false
		}
		t.Fatal(err)
	}

	return true
}

func deleteTopic(t *testing.T, region string, arn string) {
	DeleteSNSTopic(t, region, arn)
	assert.False(t, snsTopicExists(t, region, arn))
}