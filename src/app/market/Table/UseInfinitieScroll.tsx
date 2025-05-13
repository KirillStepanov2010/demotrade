import { RefObject, useCallback, useEffect, useRef } from "react"
import throttle from "lodash.throttle"

type InfiniteScrollParams = {
  ref: RefObject<HTMLDivElement> | RefObject<null>
  hasNextPage: boolean | undefined
  isFetchingNextPage: boolean | undefined
  fetchNextPage: () => void
  threshold?: number
  throttleDelay?: number
}

export const useInfiniteScroll = ({
  ref,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 100,
  throttleDelay = 700,
}: InfiniteScrollParams) => {
  const handleScroll = useCallback(
    throttle(() => {
      const container = ref.current
      if (!container) return

      const { scrollTop, scrollHeight, clientHeight } = container
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + threshold

      if (isAtBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }, throttleDelay),
    [
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
      ref,
      threshold,
      throttleDelay,
    ]
  )

  useEffect(() => {
    const container = ref.current
    if (!container) return

    container.addEventListener("scroll", handleScroll)

    return () => {
      handleScroll.cancel()
      container.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll, ref])
}
