// lib/contexts/search-context.ts
import { getContext, setContext } from 'svelte';
import type { PageableEntry } from "$lib/core/model/pageable-entry";
import type { Restaurant } from "$lib/core/model/restaurant";
import type { PublicUser } from "$lib/core/model/public-user";
import type { SyncState } from "$lib/core/model/sync-state";
import { searchRestaurants } from "$lib/core/actions/searches/search-restaurant";
import { searchUsers } from "$lib/core/actions/searches/search-user";
import type { Food } from '../model/food';
import { syncSuccess } from '../actions/util';

type SearchResults = {
  users: SyncState<PageableEntry<PublicUser>> | null;
  restaurants: SyncState<PageableEntry<Restaurant>> | null;
  foods: SyncState<PageableEntry<Food>> | null;
};

class SearchContext {
  results: SearchResults = $state({
    users: null,
    restaurants: null,
    foods: null
  });
  
  loading = $state(false);
  currentQuery = $state('');

  async searchUsers(query: string) {
    this.loading = true;
    this.currentQuery = query;
    this.results.users = await searchUsers(query);
    this.loading = false;
  }

  async searchRestaurants(query: string) {
    this.loading = true;
    this.currentQuery = query;
    this.results.restaurants = await searchRestaurants(query);
    this.loading = false;
  }
  
  clearResults() {
    this.results = {
      users: null,
      restaurants: null,
      foods: null
    };
    this.currentQuery = '';
  }
}

const SEARCH_CONTEXT_KEY = Symbol('search');

export function setSearchContext() {
  const context = new SearchContext();
  setContext(SEARCH_CONTEXT_KEY, context);
  return context;
}

export function getSearchContext(): SearchContext {
  const context = getContext<SearchContext>(SEARCH_CONTEXT_KEY);
  if (!context) {
    throw new Error('Search context not found. Make sure to call setSearchContext() in a parent component.');
  }
  return context;
}