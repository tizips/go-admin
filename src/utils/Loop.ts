export default {
  byId: (items: any[], id?: number, callback?: (item: any, index: number, items: any[]) => void) => {
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].id === id) {
        callback?.(items[i], i, items);
        break;
      }
    }
  },
};