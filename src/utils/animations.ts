import { gsap } from 'gsap';

export class ProcessorAnimations {
  private static timeline: gsap.core.Timeline | null = null;

  static createTimeline(): gsap.core.Timeline {
    if (this.timeline) {
      this.timeline.kill();
    }
    this.timeline = gsap.timeline();
    return this.timeline;
  }

  static animateRegisterUpdate(registerName: string, newValue: string): Promise<void> {
    return new Promise((resolve) => {
      const registerEl = document.querySelector(`[data-register="${registerName}"]`);
      const valueEl = document.querySelector(`[data-register-value="${registerName}"]`);
      
      if (registerEl && valueEl) {
        gsap.timeline()
          .to(registerEl, {
            scale: 1.05,
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)',
            duration: 0.3,
            ease: 'power2.out'
          })
          .to(valueEl, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
              valueEl.textContent = newValue;
            }
          })
          .to(valueEl, {
            opacity: 1,
            duration: 0.2
          })
          .to(registerEl, {
            scale: 1,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            duration: 0.3,
            ease: 'power2.out',
            onComplete: resolve
          });
      } else {
        resolve();
      }
    });
  }

  static animateFlagUpdate(flagName: string, isActive: boolean): Promise<void> {
    return new Promise((resolve) => {
      const flagEl = document.querySelector(`[data-flag="${flagName}"]`);
      
      console.log(`Looking for flag element: [data-flag="${flagName}"]`);
      console.log(`Flag element found:`, flagEl);
      console.log(`Flag ${flagName} should be active:`, isActive);
      
      if (flagEl) {
        const activeColor = isActive ? '#10B981' : '#EF4444';
        const glowColor = isActive ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.2)';
        
        console.log(`Animating flag ${flagName} to color:`, activeColor);
        
        gsap.timeline()
          .to(flagEl, {
            scale: 1.1,
            duration: 0.2,
            ease: 'power2.out'
          })
          .to(flagEl, {
            backgroundColor: activeColor,
            boxShadow: `0 0 15px ${glowColor}`,
            duration: 0.3,
            ease: 'power2.inOut'
          })
          .to(flagEl, {
            scale: 1,
            duration: 0.2,
            ease: 'power2.out',
            onComplete: () => {
              console.log(`Flag ${flagName} animation completed`);
              resolve();
            }
          });
      } else {
        console.log(`Flag element not found for: ${flagName}`);
        resolve();
      }
    });
  }

  static animateDataFlow(fromElement: string, toElement: string): Promise<void> {
    return new Promise((resolve) => {
      const from = document.querySelector(fromElement);
      const to = document.querySelector(toElement);
      
      if (from && to) {
        // Create animated dot
        const dot = document.createElement('div');
        dot.className = 'fixed w-4 h-4 bg-blue-500 rounded-full z-50 pointer-events-none shadow-lg shadow-blue-500/50';
        document.body.appendChild(dot);
        
        const fromRect = from.getBoundingClientRect();
        const toRect = to.getBoundingClientRect();
        
        // Position dot at source
        gsap.set(dot, {
          left: fromRect.left + fromRect.width / 2,
          top: fromRect.top + fromRect.height / 2
        });
        
        // Create glowing trail effect
        const trail = document.createElement('div');
        trail.className = 'fixed w-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent z-40 pointer-events-none opacity-70';
        document.body.appendChild(trail);
        
        // Calculate path
        const deltaX = toRect.left + toRect.width / 2 - (fromRect.left + fromRect.width / 2);
        const deltaY = toRect.top + toRect.height / 2 - (fromRect.top + fromRect.height / 2);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        
        gsap.set(trail, {
          left: fromRect.left + fromRect.width / 2,
          top: fromRect.top + fromRect.height / 2,
          width: 0,
          height: '2px',
          transformOrigin: 'left center',
          rotation: angle
        });
        
        gsap.timeline()
          .to(trail, {
            width: distance,
            duration: 0.6,
            ease: 'power2.out'
          })
          .to(dot, {
            left: toRect.left + toRect.width / 2,
            top: toRect.top + toRect.height / 2,
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => {
              document.body.removeChild(dot);
              document.body.removeChild(trail);
              resolve();
            }
          }, '-=0.3');
      } else {
        resolve();
      }
    });
  }

  static animateValueTransfer(value: string, fromElement: string, toElement: string): Promise<void> {
    return new Promise((resolve) => {
      const from = document.querySelector(fromElement);
      const to = document.querySelector(toElement);
      
      if (from && to) {
        // Create animated value display
        const valueDisplay = document.createElement('div');
        valueDisplay.className = 'fixed bg-blue-600 text-white px-3 py-1 rounded-lg font-mono text-sm z-50 pointer-events-none shadow-lg';
        valueDisplay.textContent = value;
        document.body.appendChild(valueDisplay);
        
        const fromRect = from.getBoundingClientRect();
        const toRect = to.getBoundingClientRect();
        
        // Position value display at source
        gsap.set(valueDisplay, {
          left: fromRect.left + fromRect.width / 2 - 20,
          top: fromRect.top - 30,
          scale: 0.8,
          opacity: 0
        });
        
        gsap.timeline()
          .to(valueDisplay, {
            opacity: 1,
            scale: 1,
            duration: 0.2
          })
          .to(valueDisplay, {
            left: toRect.left + toRect.width / 2 - 20,
            top: toRect.top - 30,
            duration: 0.8,
            ease: 'power2.inOut'
          })
          .to(valueDisplay, {
            opacity: 0,
            scale: 0.8,
            duration: 0.2,
            onComplete: () => {
              document.body.removeChild(valueDisplay);
              resolve();
            }
          });
      } else {
        resolve();
      }
    });
  }

  static animateALU(operation: string): Promise<void> {
    return new Promise((resolve) => {
      const aluEl = document.querySelector('[data-alu="true"]');
      const operationEl = document.querySelector('[data-alu-operation="true"]');
      
      if (aluEl && operationEl) {
        operationEl.textContent = operation;
        
        gsap.timeline()
          .to(aluEl, {
            scale: 1.1,
            backgroundColor: '#3B82F6',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)',
            duration: 0.5,
            ease: 'power2.out'
          })
          .to(operationEl, {
            opacity: 1,
            scale: 1.2,
            duration: 0.3
          })
          .to(operationEl, {
            opacity: 0.7,
            scale: 1,
            duration: 0.3
          })
          .to(aluEl, {
            scale: 1,
            backgroundColor: '#6B7280',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
              operationEl.textContent = '';
              resolve();
            }
          });
      } else {
        resolve();
      }
    });
  }

  static highlightInstruction(): Promise<void> {
    return new Promise((resolve) => {
      const instructionEl = document.querySelector('[data-instruction="true"]');
      
      if (instructionEl) {
        gsap.timeline()
          .to(instructionEl, {
            backgroundColor: '#FEF3C7',
            borderColor: '#F59E0B',
            duration: 0.3,
            ease: 'power2.out'
          })
          .to(instructionEl, {
            backgroundColor: '#FFFFFF',
            borderColor: '#D1D5DB',
            duration: 0.5,
            delay: 1,
            ease: 'power2.out',
            onComplete: resolve
          });
      } else {
        resolve();
      }
    });
  }

  static cleanup(): void {
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
  }

  static animateMemoryRead(): Promise<void> {
    return new Promise((resolve) => {
      const memoryEl = document.querySelector('[data-memory="true"]');
      
      if (memoryEl) {
        gsap.timeline()
          .to(memoryEl, {
            scale: 1.05,
            backgroundColor: '#8B5CF6',
            boxShadow: '0 0 25px rgba(139, 92, 246, 0.6)',
            duration: 0.4,
            ease: 'power2.inOut'
          })
          .to(memoryEl, {
            scale: 1,
            backgroundColor: '#6B7280',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            duration: 0.4,
            ease: 'power2.out',
            onComplete: resolve
          });
      } else {
        resolve();
      }
    });
  }

  static animateInstructionRegister(): Promise<void> {
    return new Promise((resolve) => {
      const irEl = document.querySelector('[data-instruction-register="true"]');
      
      if (irEl) {
        gsap.timeline()
          .to(irEl, {
            scale: 1.05,
            backgroundColor: '#EAB308',
            boxShadow: '0 0 25px rgba(234, 179, 8, 0.6)',
            duration: 0.4,
            ease: 'power2.inOut'
          })
          .to(irEl, {
            scale: 1,
            backgroundColor: '#6B7280',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            duration: 0.4,
            ease: 'power2.out',
            onComplete: resolve
          });
      } else {
        resolve();
      }
    });
  }

  static animateControlUnit(): Promise<void> {
    return new Promise((resolve) => {
      const cuEl = document.querySelector('[data-control-unit="true"]');
      
      if (cuEl) {
        gsap.timeline()
          .to(cuEl, {
            scale: 1.05,
            backgroundColor: '#10B981',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.6)',
            duration: 0.4,
            ease: 'power2.inOut'
          })
          .to(cuEl, {
            scale: 1,
            backgroundColor: '#6B7280',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            duration: 0.4,
            ease: 'power2.out',
            onComplete: resolve
          });
      } else {
        resolve();
      }
    });
  }

  static animateRegisterBank(): Promise<void> {
    return new Promise((resolve) => {
      const rbEl = document.querySelector('[data-register-bank="true"]');
      
      if (rbEl) {
        gsap.timeline()
          .to(rbEl, {
            scale: 1.05,
            backgroundColor: '#EF4444',
            boxShadow: '0 0 25px rgba(239, 68, 68, 0.6)',
            duration: 0.4,
            ease: 'power2.inOut'
          })
          .to(rbEl, {
            scale: 1,
            backgroundColor: '#6B7280',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            duration: 0.4,
            ease: 'power2.out',
            onComplete: resolve
          });
      } else {
        resolve();
      }
    });
  }
}