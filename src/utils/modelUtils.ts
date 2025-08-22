import { ModelDefinition } from "@/components/widgets/ListView/ListView"

export const defineModel = (singular: string, plural=null): ModelDefinition => {
    return {
        singular: singular,
        plural: plural ?? `${singular}s`
    }
}