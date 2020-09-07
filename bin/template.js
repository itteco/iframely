const fs = require('fs')
const { join } = require('path')

const generateTemplate = (from, to) => {
  const fileContent = fs.readFileSync(`${__dirname}/../templates/${from}`, 'utf8')

  const updatedContent = fileContent
    .replace(/AWS_ACCOUNT_ID/g, process.env.AWS_ACCOUNT_ID)
    .replace(/AWS_REGION/g, process.env.AWS_REGION)
    .replace(/AWS_IAM_ROLE/g, process.env.AWS_IAM_ROLE)
    .replace(/AWS_FN_NAME/g, process.env.AWS_FN_NAME)
    .replace(/AWS_API_STAGE/g, process.env.AWS_API_STAGE)

  const filePath = join(`${__dirname}/../${to}`)
  fs.writeFileSync(filePath, updatedContent, 'utf-8')
}

generateTemplate('cloudformation.template.yaml', 'cloudformation.yaml')
generateTemplate('simple-proxy-api.template.yaml', 'simple-proxy-api.yaml')
