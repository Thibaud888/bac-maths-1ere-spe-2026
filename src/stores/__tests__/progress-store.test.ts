import { describe, it, expect, beforeEach } from 'vitest';
import { act } from 'react';
import { useProgressStore } from '../progress-store';

beforeEach(() => {
  act(() => {
    useProgressStore.getState().reset();
  });
});

describe('recordAttempt', () => {
  it('records a failed attempt', () => {
    act(() => {
      useProgressStore.getState().recordAttempt('a-test-001', false);
    });
    const item = useProgressStore.getState().items['a-test-001'];
    expect(item).toBeDefined();
    expect(item?.attempts).toBe(1);
    expect(item?.succeeded).toBe(false);
  });

  it('records a successful attempt', () => {
    act(() => {
      useProgressStore.getState().recordAttempt('c-test-001', true);
    });
    const item = useProgressStore.getState().items['c-test-001'];
    expect(item?.succeeded).toBe(true);
  });

  it('once succeeded, stays succeeded on subsequent failures', () => {
    act(() => {
      useProgressStore.getState().recordAttempt('a-test-002', true);
      useProgressStore.getState().recordAttempt('a-test-002', false);
    });
    expect(useProgressStore.getState().items['a-test-002']?.succeeded).toBe(true);
  });

  it('increments attempts count', () => {
    act(() => {
      useProgressStore.getState().recordAttempt('e-test-001', false);
      useProgressStore.getState().recordAttempt('e-test-001', false);
      useProgressStore.getState().recordAttempt('e-test-001', true);
    });
    expect(useProgressStore.getState().items['e-test-001']?.attempts).toBe(3);
  });
});

describe('reset', () => {
  it('clears all items when called without argument', () => {
    act(() => {
      useProgressStore.getState().recordAttempt('a-001', true);
      useProgressStore.getState().recordAttempt('c-001', false);
      useProgressStore.getState().reset();
    });
    expect(useProgressStore.getState().items).toEqual({});
  });

  it('clears a single item when called with id', () => {
    act(() => {
      useProgressStore.getState().recordAttempt('a-001', true);
      useProgressStore.getState().recordAttempt('a-002', true);
      useProgressStore.getState().reset('a-001');
    });
    expect(useProgressStore.getState().items['a-001']).toBeUndefined();
    expect(useProgressStore.getState().items['a-002']).toBeDefined();
  });
});

describe('countSucceeded', () => {
  it('counts succeeded automatisms by prefix', () => {
    act(() => {
      useProgressStore.getState().recordAttempt('a-001', true);
      useProgressStore.getState().recordAttempt('a-002', false);
      useProgressStore.getState().recordAttempt('c-001', true);
    });
    expect(useProgressStore.getState().countSucceeded('automatism')).toBe(1);
    expect(useProgressStore.getState().countSucceeded('classic')).toBe(1);
    expect(useProgressStore.getState().countSucceeded('exam')).toBe(0);
  });

  it('counts unique exercises, not individual questions, for classic', () => {
    act(() => {
      useProgressStore.getState().recordAttempt('c-suites-001::q1', true);
      useProgressStore.getState().recordAttempt('c-suites-001::q2', true);
      useProgressStore.getState().recordAttempt('c-suites-002::q1', false);
    });
    expect(useProgressStore.getState().countSucceeded('classic')).toBe(1);
  });

  it('counts unique exercises for exam, including sub-questions', () => {
    act(() => {
      useProgressStore.getState().recordAttempt('e-derivation-001::q1', true);
      useProgressStore.getState().recordAttempt('e-derivation-001::q1a', true);
      useProgressStore.getState().recordAttempt('e-derivation-002::q1', true);
    });
    expect(useProgressStore.getState().countSucceeded('exam')).toBe(2);
  });
});
