export type LRC = 'left' | 'right' | 'center'

export type TextFormatSettings = {
    fontSizeInRem: number;
    textAlignText: LRC;
    textAlignTranslation: LRC;
    invertColors: boolean;
}

export const defaultTextFormatSettings: TextFormatSettings = {
    fontSizeInRem: 1,
    textAlignText: 'center',
    textAlignTranslation: 'left',
    invertColors: false,
}