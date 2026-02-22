export async function render(url: string) {
  await import('@module-federation/runtime');
  const { default: render } = await import('./bootstrap.server');
  return render(url);
}
