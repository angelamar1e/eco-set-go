// types.ts
export interface PostCard {
    id: string;
    content: string;
    userName: string;
    userHandle: string;
    userIcon: string;
  }
  
  export interface MarketplacePost extends PostCard {
    contactNumber: string;
    price: string;
    //add link
  }
  