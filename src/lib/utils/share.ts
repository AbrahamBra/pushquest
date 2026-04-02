import type { Boss } from '$lib/game/bosses';
import type { BattleState } from '$lib/game/battle-engine';

/**
 * Generate a share image using Canvas 2D API.
 * Returns a Blob (PNG) for sharing or download.
 */
export async function generateShareImage(params: {
  boss: Boss;
  state: BattleState;
  playerLevel: number;
}): Promise<Blob> {
  const { boss, state, playerLevel } = params;
  const W = 1080;
  const H = 1350;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#08080F';
  ctx.fillRect(0, 0, W, H);

  // Grid pattern
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Red glow orb
  const grad = ctx.createRadialGradient(W * 0.7, H * 0.2, 0, W * 0.7, H * 0.2, 300);
  grad.addColorStop(0, 'rgba(230,57,70,0.15)');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Gold glow orb
  const grad2 = ctx.createRadialGradient(W * 0.3, H * 0.75, 0, W * 0.3, H * 0.75, 250);
  grad2.addColorStop(0, 'rgba(255,209,102,0.08)');
  grad2.addColorStop(1, 'transparent');
  ctx.fillStyle = grad2;
  ctx.fillRect(0, 0, W, H);

  // PushQuest branding
  ctx.fillStyle = 'rgba(230,57,70,0.7)';
  ctx.font = 'italic 900 32px sans-serif';
  ctx.letterSpacing = '6px';
  ctx.textAlign = 'center';
  ctx.fillText('PUSHQUEST', W / 2, 80);

  // System line
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '16px monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText('◆ BOSS BATTLES ◆', W / 2, 120);

  // Result
  const isVictory = state.result === 'victory';
  ctx.fillStyle = isVictory ? '#FFD166' : '#E63946';
  ctx.font = 'italic 900 72px sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText(isVictory ? 'VICTOIRE' : 'DEFAITE', W / 2, 340);

  // Boss name
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = '900 48px sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText(boss.name, W / 2, 440);

  // Divider line
  const divGrad = ctx.createLinearGradient(W * 0.2, 0, W * 0.8, 0);
  divGrad.addColorStop(0, 'transparent');
  divGrad.addColorStop(0.5, isVictory ? 'rgba(255,209,102,0.6)' : 'rgba(230,57,70,0.6)');
  divGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = divGrad;
  ctx.fillRect(0, 500, W, 3);

  // Stats
  ctx.textAlign = 'center';
  const stats = [
    { label: 'REPS', value: String(state.reps) },
    { label: 'XP', value: `+${state.xpEarned}` },
    { label: 'LEVEL', value: String(playerLevel) },
  ];

  const statW = W / 3;
  stats.forEach((s, i) => {
    const x = statW * i + statW / 2;
    // Value
    ctx.fillStyle = '#E63946';
    ctx.font = '900 64px monospace';
    ctx.letterSpacing = '2px';
    ctx.fillText(s.value, x, 620);
    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '14px monospace';
    ctx.letterSpacing = '4px';
    ctx.fillText(s.label, x, 660);
  });

  // Time
  const mins = Math.floor(state.timeElapsedSecs / 60);
  const secs = state.timeElapsedSecs % 60;
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '20px monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText(`TEMPS: ${mins}:${secs.toString().padStart(2, '0')}`, W / 2, 740);

  // HP progress bar (if defeat)
  if (!isVictory) {
    const barW = 600;
    const barH = 24;
    const barX = (W - barW) / 2;
    const barY = 790;
    const pct = state.damageDealt / state.bossMaxHP;

    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(barX, barY, barW, barH);
    const barGrad = ctx.createLinearGradient(barX, 0, barX + barW * pct, 0);
    barGrad.addColorStop(0, '#A0101A');
    barGrad.addColorStop(1, '#E63946');
    ctx.fillStyle = barGrad;
    ctx.fillRect(barX, barY, barW * pct, barH);

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '14px monospace';
    ctx.fillText(`${Math.round(pct * 100)}% DAMAGE`, W / 2, barY + barH + 30);
  }

  // CTA
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.font = '18px monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText('RELEVE LE DEFI', W / 2, H - 120);

  // URL
  ctx.fillStyle = 'rgba(230,57,70,0.5)';
  ctx.font = '16px monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('pushquest.app', W / 2, H - 70);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to generate image'));
    }, 'image/png');
  });
}

/**
 * Share battle results using Web Share API with download fallback.
 */
export async function shareResult(params: {
  boss: Boss;
  state: BattleState;
  playerLevel: number;
}): Promise<void> {
  const { boss, state } = params;
  const isVictory = state.result === 'victory';

  const text = isVictory
    ? `Je viens de vaincre ${boss.name} en ${state.reps} reps sur PushQuest ! Ose me defier 💀`
    : `J'ai inflige ${Math.round((state.damageDealt / state.bossMaxHP) * 100)}% de degats a ${boss.name} sur PushQuest ! Prochaine fois c'est la bonne ⚔️`;

  try {
    const blob = await generateShareImage(params);
    const file = new File([blob], 'pushquest-result.png', { type: 'image/png' });

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        text,
        files: [file],
      });
    } else if (navigator.share) {
      await navigator.share({ text, url: 'https://pushquest.app' });
    } else {
      // Fallback: download
      downloadImage(blob);
    }
  } catch (e) {
    // User cancelled share or share not supported
    if ((e as Error)?.name !== 'AbortError') {
      try {
        const blob = await generateShareImage(params);
        downloadImage(blob);
      } catch {}
    }
  }
}

function downloadImage(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pushquest-result.png';
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Share an invite link using Web Share API.
 */
export async function shareInvite(friendCode?: string): Promise<void> {
  const text = friendCode
    ? `Rejoins-moi sur PushQuest ! Utilise mon code ${friendCode} pour commencer 💪`
    : 'Rejoins-moi sur PushQuest - le fitness gamifie en mode Dark Souls ! ⚔️';

  try {
    await navigator.share({
      title: 'PushQuest',
      text,
      url: 'https://pushquest.app',
    });
  } catch {}
}
