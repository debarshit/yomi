// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { BUILTIN_WEB_SEARCH_IDS } from '@/services/dictionaries/types';
import {
  BUILTIN_WEB_SEARCHES,
  getBuiltinWebSearch,
  substituteUrlTemplate,
} from '@/services/dictionaries/webSearchTemplates';

describe('Built-in web searches', () => {
  it('registers Google, Urban Dictionary, and Merriam-Webster templates', () => {
    const ids = BUILTIN_WEB_SEARCHES.map((t) => t.id);
    expect(ids).toEqual([
      BUILTIN_WEB_SEARCH_IDS.google,
      BUILTIN_WEB_SEARCH_IDS.urban,
      BUILTIN_WEB_SEARCH_IDS.merriamWebster,
    ]);
  });

  it('resolves templates by id', () => {
    expect(getBuiltinWebSearch(BUILTIN_WEB_SEARCH_IDS.google)?.name).toBe('Google');
    expect(getBuiltinWebSearch(BUILTIN_WEB_SEARCH_IDS.urban)?.name).toBe('Urban Dictionary');
    expect(getBuiltinWebSearch(BUILTIN_WEB_SEARCH_IDS.merriamWebster)?.name).toBe(
      'Merriam-Webster',
    );
  });

  it('substitutes %WORD% in url templates correctly', () => {
    const google = getBuiltinWebSearch(BUILTIN_WEB_SEARCH_IDS.google)!;
    expect(substituteUrlTemplate(google.urlTemplate, 'ephemeral')).toBe(
      'https://www.google.com/search?q=define:ephemeral&hl=en',
    );
  });
});
