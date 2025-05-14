class OverlayCloseManager {
  private overlaysClosers: Array<() => void> = [];

  subscribe(close: () => void) {
    this.overlaysClosers.push(close);
  }

  closeAll() {
    this.overlaysClosers.forEach(close => close());
  }
}

export const overlayCloseManager = new OverlayCloseManager();
