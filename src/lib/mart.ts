// '이마트천호점' → '천호점'
export function shortMartName(name: string) {
  return name.replace(/^이마트/, "");
}
