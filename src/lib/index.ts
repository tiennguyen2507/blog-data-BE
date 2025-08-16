// The fieldSelector object provides methods to generate strings for including or excluding fields in a query.
export const fieldSelector = {
  include: (value: string[], { withId }: { withId?: boolean } = {}): string =>
    value.map(field => `${field}`).join(' ') + `${!withId ? ' -_id' : ''}`,
  exclude: (value: string[], { withId }: { withId?: boolean } = {}): string =>
    value.map(field => `-${field}`).join(' ') + `${!withId ? ' -_id -__v' : ' -__v'}`,
};

// Export pagination utilities
export * from './pagination';
