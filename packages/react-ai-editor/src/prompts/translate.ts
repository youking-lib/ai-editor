// Refer from https://github.com/openai-translator/openai-translator/blob/2a1b067c30ab74c9e8b20e77ebdb58ca76ce0edc/src/common/translate.ts#L403
// Modifier by youking-lib

import { LANG_CONFIG } from "./language";

type TranslateOptions = {
  target: keyof typeof LANG_CONFIG;
  text: string;
};

export function translate(options: TranslateOptions) {
  const config = getLanguageConfig(options.target);

  if (isAWord(options.target, options.text)) {
    return AWordEnhance(options);
  }

  return {
    rolePrompt: "You are a translator, translate directly without explanation.",
    prompt: `Translate the following text to ${config.name} without the style of machine translation.
${options.text}`,
  };
}

function getLanguageConfig(key: keyof typeof LANG_CONFIG) {
  return LANG_CONFIG[key];
}

function AWordEnhance(options: TranslateOptions) {
  const target = getLanguageConfig(options.target);

  if (target.name === LANG_CONFIG.zh.name) {
    // 单词模式，可以更详细的翻译结果，包括：音标、词性、含义、双语示例。
    return {
      prompt: `单词是：${options.text}`,
      rolePrompt:
        "你是一个翻译引擎，请翻译给出的文本，只需要翻译不需要解释。" +
        "当且仅当文本只有一个单词时，" +
        "请给出单词原始形态（如果有）、" +
        "单词的语种、" +
        "对应的音标或转写、" +
        "所有含义（含词性）、" +
        "双语示例，至少三条例句。" +
        "如果你认为单词拼写错误，请提示我最可能的正确拼写，" +
        "否则请严格按照下面格式给到翻译结果：" +
        `<单词>
[<语种>]· / <Pinyin>}
[<词性缩写>] <中文含义>]
例句：
<序号><例句>(例句翻译)
词源：
<词源>`,
    };
  }

  return {
    commandPrompt: "I understand. Please give me the word.",
    contentPrompt: `The word is: ${options.text}`,
    rolePrompt:
      "You are a professional translation engine." +
      "Please translate the text into ${targetLangName} without explanation." +
      "When the text has only one word," +
      "please act as a professional" +
      `${target.name} dictionary` +
      "and list the original form of the word (if any)," +
      "the language of the word," +
      "all senses with parts of speech," +
      "sentence examples (at least 3) and etymology. If you think there is a spelling mistake, please tell me the most possible correct word otherwise reply in the following format:" +
      `<word> (<original form>)
[<language>]· /
[<part of speech>] <translated meaning> /
<meaning in source language>
Examples:
<index>. <sentence>(<sentence translation>)
Etymology:
<etymology>`,
  };
}

export function isAWord(langCode: string, text: string) {
  const { Segmenter } = Intl as any;
  if (!Segmenter) {
    return false;
  }
  const segmenter = new Segmenter(langCode, { granularity: "word" });
  const iterator = segmenter.segment(text)[Symbol.iterator]();
  return iterator.next().value?.segment === text;
}
