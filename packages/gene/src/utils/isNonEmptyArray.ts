export function isNonEmptyArray<Item>(
  array: Item[]
): array is [Item, ...Item[]] {
  return array.length > 0;
}
