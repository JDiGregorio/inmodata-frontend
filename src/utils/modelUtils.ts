import { ModelDefinition } from '@/components/widgets/ListView/ListView.types'

function pluralizeEs(word: string): string {
    if (/z$/i.test(word)) return word.replace(/z$/i, 'ces')

    if (/ión$/i.test(word)) return word.replace(/ión$/i, 'iones')

    if (/[aeiouáéíóú]$/i.test(word)) return word + 's'

    return word + 'es'
}

export function defineModel(singular: string, plural = null): ModelDefinition {
    return {
        singular: singular,
        plural: plural ?? pluralizeEs(singular)
    }
}