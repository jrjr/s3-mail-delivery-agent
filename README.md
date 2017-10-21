# s3-mail-delivery-agent
This is a (MDA) Mail Delivery Agent. It uses AWS SES, SNS, S3, and Postfix to deliver S3 raw emails to Dovecot.

# Why
The problem this is solving is to make receiving emails from AWS Simple Email Service easy and to reduce cost. EC2 hosted instance receiving is free for the first 1000 emails https://aws.amazon.com/ses/pricing/

# Assumptions
This requires that you've setup Dovecot, Postfix, AWS SNS, AWS SES, and S3.

# Flow of how it works
Let's say bob@gmail.com wants to send an email to john@yourdomain.com. The DNS MX record for your domain is looked up and gmail will send the mail to the AWS incoming SMTP server. SES will then store the email to your S3 bucket and will publish a new notification to the SNS topic you configured. This project is hosted on your email server and has subscribed to the SNS notification. It recieves the notification and will download the raw email from your S3 bucket. From there it will use Postfix's sendmail program to deliver the email locally to Dovecot via LMTP on a unix socket. Now the email has been delivered.

