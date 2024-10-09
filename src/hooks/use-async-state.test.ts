import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAsyncState } from "./use-async-state";

describe("useAsyncState", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useAsyncState());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
  });

  it("should initialize with custom initial loading state", () => {
    const { result } = renderHook(() => useAsyncState(true));
    expect(result.current.isLoading).toBe(true);
  });

  it("should update loading state", () => {
    const { result } = renderHook(() => useAsyncState());
    act(() => {
      result.current.setLoading(true);
    });
    expect(result.current.isLoading).toBe(true);
  });

  it("should update error state", () => {
    const { result } = renderHook(() => useAsyncState<string>());
    act(() => {
      result.current.setError("Test error");
    });
    expect(result.current.error).toBe("Test error");
    expect(result.current.isError).toBe(true);
  });

  it("should reset state", () => {
    const { result } = renderHook(() => useAsyncState<string>());
    act(() => {
      result.current.setLoading(true);
      result.current.setError("Test error");
    });
    act(() => {
      result.current.reset();
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
  });

  it("should reset state with custom initial loading", () => {
    const { result } = renderHook(() => useAsyncState<string>());
    act(() => {
      result.current.setLoading(true);
      result.current.setError("Test error");
    });
    act(() => {
      result.current.reset(true);
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isError).toBe(false);
  });
});
