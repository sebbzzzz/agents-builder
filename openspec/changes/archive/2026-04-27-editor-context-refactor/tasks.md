## 1. Create EditorContext

- [x] 1.1 Create `app/_contexts/EditorContext.tsx` as a `"use client"` file with `EditorProvider` component and `useEditorContext` hook
- [x] 1.2 Implement private `viewRef` inside the Provider and `mount(container, content)` callback
- [x] 1.3 Implement `destroy()` callback that destroys the view and clears the ref
- [x] 1.4 Move inject logic from `app/_utils/injectOption.ts` into a `injectOption(categoryLabel, prompt)` callback inside the Provider
- [x] 1.5 Wrap all callbacks in `useCallback` and the context value in `useMemo` to keep references stable
- [x] 1.6 Add guard in `useEditorContext` that throws if called outside a Provider

## 2. Wire CodeEditorView to context

- [x] 2.1 Remove the `editorViewRef` prop from `CodeEditorView` component interface
- [x] 2.2 Replace the `useEffect` init logic: call `useEditorContext().mount(containerRef.current, content)` instead of creating the view directly
- [x] 2.3 Replace the cleanup: call `useEditorContext().destroy()` in the `useEffect` return

## 3. Wire FloatingOptionsPanel to context

- [x] 3.1 Remove the `editorViewRef` prop from `FloatingOptionsPanel` component interface
- [x] 3.2 Replace `editorViewRef.current` + `injectOption(view, ...)` call in `handleAdd` with `useEditorContext().injectOption(...)`

## 4. Remove prop threading from PreviewPanel and page

- [x] 4.1 Remove the `editorViewRef` prop from `PreviewPanel` component interface and its forward to `CodeEditorView`
- [x] 4.2 Remove `useRef<EditorView>` from `page.tsx` and the two prop passes to `FloatingOptionsPanel` and `PreviewPanel`
- [x] 4.3 Wrap the page content in `<EditorProvider>` in `page.tsx`

## 5. Cleanup

- [x] 5.1 Delete `app/_utils/injectOption.ts` (logic now lives in the context)
- [x] 5.2 Verify `app/_utils/parseHeadings.ts` is still imported by the context and no other imports of `injectOption` remain
- [x] 5.3 Run TypeScript type-check and confirm no remaining references to the removed props
