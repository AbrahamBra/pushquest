<script lang="ts">
  import { page } from '$app/state';
  import { challengeStore } from '$lib/stores/challenges';

  // Reactive pathname
  const pathname = $derived(page.url.pathname);

  // Store value reactivity via $derived with store subscription pattern
  let storeValue = $state<{ count: number; loading: boolean } | null>(null);

  $effect(() => {
    const unsub = challengeStore.subscribe((val) => {
      storeValue = val;
    });
    return unsub;
  });

  const friendsBadgeCount = $derived(
    storeValue && storeValue.count > 0 ? storeValue.count : 0
  );

  // Tab definitions
  const tabs = [
    {
      icon: '⚔️',
      label: 'Combat',
      href: '/',
      isActive: (p: string) => p === '/',
    },
    {
      icon: '📋',
      label: 'Programmes',
      href: '/programs',
      isActive: (p: string) => p.startsWith('/programs'),
    },
    {
      icon: '👥',
      label: 'Amis',
      href: '/friends',
      isActive: (p: string) => p.startsWith('/friends'),
      badge: true,
    },
    {
      icon: '🏆',
      label: 'Profil',
      href: '/profile',
      isActive: (p: string) => p.startsWith('/profile'),
    },
  ] as const;
</script>

<nav
  role="navigation"
  aria-label="Navigation principale"
  class="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
>
  <div
    class="w-full max-w-[480px] h-16 flex items-stretch border-t border-white/[0.06]"
    style="
      background: rgba(10, 10, 20, 0.95);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      padding-bottom: env(safe-area-inset-bottom, 0px);
    "
  >
    {#each tabs as tab}
      {@const active = tab.isActive(pathname)}
      {@const showBadge = 'badge' in tab && tab.badge && friendsBadgeCount > 0}

      <a
        href={tab.href}
        aria-current={active ? 'page' : undefined}
        class="relative flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors duration-150
          {active
            ? 'text-primary'
            : 'text-dim/40 hover:text-dim/70'}"
        style={active
          ? 'text-shadow: 0 0 12px rgba(230,57,70,0.6);'
          : ''}
      >
        <!-- Active indicator underline -->
        {#if active}
          <span
            class="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full bg-primary"
            style="box-shadow: 0 0 8px rgba(230,57,70,0.7);"
          ></span>
        {/if}

        <!-- Icon with badge wrapper -->
        <span class="relative inline-flex">
          <span class="text-xl leading-none">{tab.icon}</span>

          {#if showBadge}
            <span
              class="absolute -top-1.5 -right-2 min-w-[1.1rem] h-[1.1rem] flex items-center justify-center
                rounded-full bg-red-500 text-white font-bold font-mono text-[0.55rem] tracking-tight px-0.5"
              style="
                box-shadow: 0 0 8px rgba(239,68,68,0.8), 0 0 16px rgba(239,68,68,0.4);
                animation: statusDot 1.4s ease-in-out infinite;
              "
            >
              {friendsBadgeCount > 99 ? '99+' : friendsBadgeCount}
            </span>
          {/if}
        </span>

        <!-- Label -->
        <span class="font-mono text-[0.5rem] tracking-[1px] uppercase leading-none">
          {tab.label}
        </span>
      </a>
    {/each}
  </div>
</nav>
