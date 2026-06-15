/**
 * Trial Reminder System
 * Shows reminders when trial is about to expire
 */

let reminderShown = false;

async function checkTrialStatus() {
  try {
    const status = await window.electron.ipcRenderer.invoke('get-subscription-status');

    if (!status.success || !status.data) {
      return;
    }

    const subStatus = status.data;

    // Only show reminder for trial users
    if (subStatus.status !== 'trial') {
      return;
    }

    // Check if should show reminder (3 days or less)
    const shouldRemind = await window.electron.ipcRenderer.invoke('should-show-renewal-reminder');

    if (shouldRemind && !reminderShown) {
      showTrialReminder(subStatus.daysLeft);
      reminderShown = true;

      // Mark as shown in backend
      await window.electron.ipcRenderer.invoke('mark-reminder-shown');
    }

    // Show expired message if trial ended
    if (subStatus.isExpired && subStatus.status === 'expired') {
      showTrialExpired();
    }
  } catch (error) {
    console.error('[Trial Reminder] Check failed:', error);
  }
}

function showTrialReminder(daysLeft) {
  const t = window.i18nHelpers ? window.i18nHelpers.t : (key) => key;
  const message = t('toast.trialReminder', { days: daysLeft });

  if (window.copyUtils && window.copyUtils.showToast) {
    window.copyUtils.showToast(message, 'warning');
  } else {
    alert(message);
  }
}

function showTrialExpired() {
  const t = window.i18nHelpers ? window.i18nHelpers.t : (key) => key;
  const message = t('toast.trialExpired');

  if (window.copyUtils && window.copyUtils.showToast) {
    window.copyUtils.showToast(message, 'error');
  } else {
    alert(message);
  }
}

// Check trial status on app start
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    // Wait for everything to initialize
    setTimeout(() => {
      checkTrialStatus();
    }, 2000);
  });

  // Check periodically (every hour)
  setInterval(checkTrialStatus, 60 * 60 * 1000);
}

// Export for manual checks
window.trialReminder = {
  check: checkTrialStatus,
  reset: () => { reminderShown = false; }
};
