import type * as monaco from "monaco-editor";

interface AutocompleteProviderOptions {
  fetchSuggestion: (
    prefix: string,
    suffix: string,
    language: string,
    fileName: string
  ) => Promise<string>;
}

export function createAutocompleteProvider(
  options: AutocompleteProviderOptions
): monaco.languages.InlineCompletionsProvider {
  return {
    provideInlineCompletions: async (model: any, position: any, _context: any, token: any) => {
      const language = model.getLanguageId();
      const fileName = model.uri.path;

      const prefix = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      const totalLines = model.getLineCount();
      const suffix = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: Math.min(position.lineNumber + 50, totalLines),
        endColumn: model.getLineMaxColumn(
          Math.min(position.lineNumber + 50, totalLines)
        ),
      });

      try {
        const suggestion = await options.fetchSuggestion(
          prefix,
          suffix,
          language,
          fileName
        );

        if (!suggestion || token.isCancellationRequested) {
          return { items: [] };
        }

        return {
          items: [
            {
              insertText: suggestion,
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
              },
            },
          ],
        };
      } catch {
        return { items: [] };
      }
    },
    disposeInlineCompletions: () => {},
  };
}
