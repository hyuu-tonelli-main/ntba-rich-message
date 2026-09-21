import { describe, expect, it } from 'vitest';
import { buildOsInfoDocument, buildStatusDocument } from './example';

describe('buildOsInfoDocument', () => {
  it('renders the supplied operating system details', () => {
    const document = buildOsInfoDocument({
      platform: 'Windows_NT win32',
      release: '10.0.22631',
      architecture: 'x64',
      hostname: 'test-host',
      cpuModel: 'Test CPU',
      cpuCount: 8,
      totalMemory: 8 * 1024 ** 3,
      freeMemory: 2 * 1024 ** 3,
      uptime: 90061,
      nodeVersion: 'v22.0.0',
    });

    const html = document.toHTML();
    expect(html).toContain('Windows_NT win32');
    expect(html).toContain('Test CPU (8 core)');
    expect(html).toContain('6.00 GB / 8.00 GB');
    expect(html).toContain('1h 1j 1m 1d');
    expect(html).toContain('test-host');
  });
});

describe('buildStatusDocument', () => {
  it('renders online status and Telegram latency', () => {
    const html = buildStatusDocument(42).toHTML();

    expect(html).toContain('Status Bot');
    expect(html).toContain('Online');
    expect(html).toContain('42 ms');
  });
});