
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost/graphql",
  documents: "src/**/*.{tsx,ts,graphql}",
  ignoreNoDocuments: true,
  generates: {
    "src/generated-types.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo"
      ],
      config: {
        skipTypename: false,
        withHooks: true,
        withHOC: false,
        withComponent: false
      }
    }
  }
}

export default config
