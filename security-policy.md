---
layout: ballerina-inner-page
title: Security Policy
intro: We take security issues very seriously and all the vulnerability reports are treated with the highest priority and confidentiality.
permalink: /security-policy/
redirect_from:
    - /security/
    - /security
    - /security-policy
---

Thank you for taking the time to [responsibly disclose](https://en.wikipedia.org/wiki/Responsible_disclosure) any vulnerabilities you find.

## Reporting a Vulnerability

First of all, make sure that you are using the latest Ballerina version before you run an automated security scan or perform a penetration test against it. All security vulnerabilities and any other concerns related to security should be reported by sending an emailing to [security@ballerina.io](mailto:security@ballerina.io).  

> **WARNING:** To ensure end-user security, **please do not use any other medium to report security vulnerabilities**. Also, kindly refrain from disclosing the vulnerability details you come across with others, in any forums, sites, or other groups (public or private) before its mitigation and disclosure processes are completed.


If you would like, you can encrypt your report using the  following public key to send secure messages to [security@ballerina.io](mailto:security@ballerina.io):

> security@ballerina.io: 0168 DA26 2989 0DB9 4ACD 8367 E683 061E 2F85 C381 

This key can also be found at [pgp.mit.edu](https://pgp.surfnet.nl/pks/lookup?op=vindex&fingerprint=on&search=0xE683061E2F85C381).

Also, use the following template when reporting vulnerabilities so that it contains all the required information that helps expedite the analysis and mitigation process.

- **Vulnerable Ballerina artifact(s) and version(s):** list  the vulnerable Ballerina artifact(s) and version(s) 
- **Overview:** provide a high-level overview of the issue and self-assessed severity
- **Description:** include the steps to reproduce
- **Impact:** state self-assessed impact
- **Solution:** propose a  solution if you have one

We will keep you informed of the progress towards a fix and disclosure of the vulnerability if the reported issue is identified as a true positive.

## Handling a Vulnerability

Here is an overview of our approach to handling vulnerabilities:

1. The vulnerability will be reported privately to our security team at [security@ballerina.io](mailto:security@ballerina.io).

2. Your email will be acknowledged within 24 hours, and you’ll receive a detailed response to your email indicating the next steps in handling your report. You will be updated on the progress. 
3. The reported vulnerability will be confirmed and fixed by the security team at WSO2.
4. The fix will be applied to the main branch and a new version of the distribution will be released immediately if required.




3. The reported vulnerability gets fixed and the solution gets verified by the relevant teams at WSO2.
3. The fix gets applied to the main branch and a new version of the distribution gets released if required.
4. The reported user is kept updated on the progress of the process. 

## Getting Acknowledged and Rewarded

Your efforts in reporting vulnerabilities or any other issues related to the security of Ballerina will be recognized and honored via the [WSO2 Security Reward and Acknowledgement Program](https://docs.wso2.com/display/Security/WSO2+Security+Reward+and+Acknowledgement+Program). 


>**Note:** The reward program is currently applicable to vulnerabilities reported only in the following applications and code repositories:

- [Ballerina website](https://ballerina.io/)
- [Ballerina platform](https://github.com/ballerina-platform)

<style>
.nav > li.cVersionItem {
    display: none !important;
}
</style>
<style> #tree-expand-all , #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>
