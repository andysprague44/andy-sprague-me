
# Hosting strapi

Used guide here: 
https://strapi.io/integrations/aws

Connect to strapi EC2 instance: 
```
ssh -i ~/.ssh/andysprague-me-strapi-key.pem ubuntu@<public ip>.compute.amazonaws.com
```

Get public IP from AWS console

<https://us-west-1.console.aws.amazon.com/ec2/home?region=us-west-1#Instances:v=3;$case=tags:true%5C,client:false;$regex=tags:false%5C,client:false>

