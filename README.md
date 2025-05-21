
# Hosting strapi in AWS EC2

Used guide here: 
https://strapi.io/integrations/aws

Connect to strapi EC2 instance

(Get public IP from AWS console
<https://us-west-1.console.aws.amazon.com/ec2/home?region=us-west-1#Instances:v=3;$case=tags:true%5C,client:false;$regex=tags:false%5C,client:false>)): 
```
ssh -i ~/.ssh/andysprague-me-strapi-key.pem ubuntu@<public ip>.compute.amazonaws.com
```

Setup the server:
```
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g npm@latest
node -v
npm -v
git config --global user.name "Andy Sprague"
git config --global user.name "andy.sprague44@gmail.com"
cd ~
git clone https://github.com/andysprague44/andy-sprague-me.git
cd andy-sprague-me/cms
npm install
NODE_ENV=production npm run build
npm start
```

TODO: pm2

# "Publishing" in local mode

Cheat code: use strapi locally and export the data as json, at dev time.

How to do it:
1. Run strapi locally and add your articles to it.
2. With server still running, run the export script (which saves the data to client/src/strapi.json and copies the uploads folder to client/public/uploads):
    ```
    ./client/scripts/export_strapi_content.sh
    ```
3. Commit and push the changes to GitHub (to deploy to vercel).


## tmp

```
"dev": "concurrently \"npm --prefix client run dev\" \"npm --prefix server run develop\""
```
