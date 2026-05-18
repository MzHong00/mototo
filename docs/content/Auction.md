# 경매장 시스템 (Phase 13)

MapleStory 자유시장 스타일의 **고정가 플레이어 간 거래 마켓**.

## 거래 방식

- 판매자가 아이템 + 가격 등록 → 구매자가 즉시 구매 (경매·입찰 없음)
- 로그인 없이 로컬 UUID로 신원 식별 (`auctionStore` zustand/persist)
- 매물 유효기간 7일, 일일 등록 한도 50건 (rate limit)

## 백엔드

| 항목   | 내용                                                   |
| ------ | ------------------------------------------------------ |
| 서비스 | Supabase free tier                                     |
| DB     | PostgreSQL — `auction_listings`, `transactions` 테이블 |
| API    | `@supabase/supabase-js` 브라우저 직접 호출 (서버리스)  |
| 실시간 | 폴링 30s + Visibility API (탭 비활성 시 중단)          |

## 주요 기능

| 탭          | 기능                                                  |
| ----------- | ----------------------------------------------------- |
| 전체 시장   | 매물 목록 + 아이템타입/직업/등급/가격범위 필터 + 구매 |
| 내 등록     | 내가 올린 매물 조회 + 취소                            |
| 내 거래내역 | 구매·판매 완료 이력                                   |
| 시세        | 아이템별 최근 50건 평균·최저·최고가 + 거래 건수       |

## 파일 구조

```
src/
├── server/auction/
│   ├── auction.client.ts      # Supabase 클라이언트 싱글턴
│   ├── auction.queries.ts     # 모든 query/mutation 집중 관리
│   └── auction.types.ts       # AuctionListing, Transaction, PriceStats, ListingFilter
├── stores/auctionStore.ts     # UUID 초기화 + persist
├── hooks/
│   ├── useAuctionPolling.ts   # 폴링 훅 (30s + Visibility API)
│   ├── useAuctionListings.ts  # 목록 + 필터 상태
│   ├── useMyListings.ts
│   ├── useMyTransactions.ts
│   └── usePriceStats.ts
└── components/ui/window/auctionWindow/
    ├── AuctionWindow.tsx      # WindowManager 패턴 루트
    ├── tabs/                  # MarketTab, MyListingsTab, MyHistoryTab, PriceTab
    ├── ListingCard.tsx
    ├── ListingForm.tsx
    └── MarketFilter.tsx
```

## Supabase 스키마 요약

```sql
auction_listings  -- id, seller_uuid, item_id, item_data(jsonb), price, listed_at, expires_at, status
transactions      -- id, listing_id, buyer_uuid, seller_uuid, item_data, price, completed_at
```
