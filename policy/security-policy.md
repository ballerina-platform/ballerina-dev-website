---
layout: ballerina-inner-page
title: Security policy
description: We take security issues very seriously and all the vulnerability reports are treated with the highest priority and confidentiality.
keywords: ballerina, programming language, security, security-policy, security advisories
intro: We take security issues very seriously and all the vulnerability reports are treated with the highest priority and confidentiality.
permalink: /security-policy/
redirect_from:
    - /security/
    - /security
    - /security-policy
---

Thank you for taking the time to <a target="_blank" href="https://en.wikipedia.org/wiki/Responsible_disclosure">responsibly disclose</a> any vulnerabilities you find.

## Report a vulnerability

First of all, make sure that you are using the latest Ballerina version before you run an automated security scan or perform a penetration test against it. All security vulnerabilities and any other concerns related to security should be reported by sending an email to <a target="_blank" href="mailto:security@ballerina.io">security@ballerina.io</a>.  

> **WARNING:** To ensure end-user security, **please do not use any other medium to report security vulnerabilities**. Also, kindly refrain from disclosing the vulnerability details you come across with others, in any forums, sites, or other groups (public or private) before its mitigation and disclosure processes are completed.


If you would like, you can encrypt your report using the  following public key to send secure messages to <a target="_blank" href="mailto:security@ballerina.io">security@ballerina.io</a>:

> security@ballerina.io: AC48 3C56 C0A0 6020 4BBE F3E4 182F 3F21 255F CCE9 

This key can also be found at <a target="_blank" href="https://keys.openpgp.org/vks/v1/by-fingerprint/AC483C56C0A060204BBEF3E4182F3F21255FCCE9">keys.openpgp.org</a>.

Also, use the following template when reporting vulnerabilities so that it contains all the required information that helps expedite the analysis and mitigation process.

- **Vulnerable Ballerina artifact(s) and version(s):** list  the vulnerable Ballerina artifact(s) and version(s) 
- **Overview:** provide a high-level overview of the issue and self-assessed severity
- **Description:** include the steps to reproduce
- **Impact:** state self-assessed impact
- **Solution:** propose a  solution if you have one

We will keep you informed of the progress towards fixing and disclosing of the vulnerability if the reported issue is identified as a true positive.

## Handle a vulnerability

Here is an overview of our approach to handling vulnerabilities:

1. The vulnerability will be reported privately to our security team at <a target="_blank" href="mailto:security@ballerina.io">security@ballerina.io</a>.
2. Your email will be acknowledged within 24 hours, and you’ll receive a detailed response to your email indicating the next steps in handling your report. You will be updated on the progress. 
3. In case of a true-positive finding, the reported vulnerability will be confirmed and fixed by the relevant teams at WSO2.
4. The fix will be applied to the affected components and a new version will be released immediately if required.
5. The reported user is kept updated on the progress of the process. 

## Get acknowledged and rewarded

Your efforts in reporting vulnerabilities or any other issues related to the security of Ballerina will be recognized and honored via the <a target="_blank" href="https://docs.wso2.com/display/Security/WSO2+Security+Reward+and+Acknowledgement+Program">WSO2 security reward and acknowledgement program</a>. 


>**Note:** The reward program is currently applicable to vulnerabilities reported only in the <a target="_blank" href="https://github.com/ballerina-platform/ballerina-lang/">compiler, runtime, CLI tooling</a>, <a target="_blank" href="https://github.com/ballerina-platform/ballerina-standard-library">standard library</a>, <a target="_blank" href="https://marketplace.visualstudio.com/items?itemName=wso2.ballerina">VS Code extension</a>, and <a target="_blank" href="https://ballerina.io">website</a>.

## Security advisories

The below are the Ballerina security advisories that are already published.

### Compiler, runtime, and CLI tooling

- <a target="_blank" href="https://github.com/ballerina-platform/ballerina-lang/security/advisories/GHSA-f5qg-fqrw-v5ww">CVE-2021-32700</a>
