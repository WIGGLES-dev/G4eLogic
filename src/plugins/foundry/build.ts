import type { JSONSchema } from "@apidevtools/json-schema-ref-parser";
interface EntityTypeConfig {
    types: string[]
    templates: Record<string, any>
    [key: string]: Record<string, any>
}
interface FoundryTemplate {
    Actor?: EntityTypeConfig
    Item?: EntityTypeConfig
}
async function jsonSchemaToFoundryTemplate(...schemas: JSONSchema[]): Promise<FoundryTemplate> {
    const template: FoundryTemplate = {}
    for (const schema of schemas) {
        if (schema.type !== "object") continue
        for (const [key, value] of Object.entries(schema.properties)) {

        }
    }
    return template
}