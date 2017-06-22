'use strict'

/* globals beforeAll, test, expect */

const OasGraph = require('../index.js')
const {
  parse,
  validate
} = require('graphql')

/**
 * Set up the schema first
 */
let oas = require('./fixtures/government_social_work_api.json')
let schema
beforeAll(() => {
  return OasGraph.createGraphQlSchema(oas)
    .then(createdSchema => {
      schema = createdSchema
    })
})

test('All query endpoints present', () => {
  let oasGetCount = 0
  for (let path in oas.paths) {
    for (let method in oas.paths[path]) {
      if (method === 'get') oasGetCount++
    }
  }
  let gqlTypes = Object.keys(schema
    ._typeMap
    .RootQueryType
    .getFields()
    .viewerAnyAuth
    .type
    .getFields()
  ).length
  expect(gqlTypes).toEqual(oasGetCount)
})

test('All mutation endpoints present', () => {
  let oasMutCount = 0
  for (let path in oas.paths) {
    for (let method in oas.paths[path]) {
      if (method !== 'get') oasMutCount++
    }
  }
  let gqlTypes = Object.keys(schema
    ._typeMap
    .RootMutationType
    .getFields()
    .mutationViewerAnyAuth
    .type
    .getFields()
  ).length
  expect(gqlTypes).toEqual(oasMutCount)
})

test('Get resource', () => {
  let query = `{
    viewerAnyAuth {
      AssessmentTypes (
        ContentType: ""
        AcceptLanguage: ""
        UserAgent:""
        ApiVersion:"1.1.0"
        offset: "40"
        limit: "test"
      ) {
        data {
          assessmentTypeId
        }
      }
    }
  }`
  let ast = parse(query)
  let errors = validate(schema, ast)
  expect(errors).toEqual([])
})
