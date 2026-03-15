export interface CommentItem {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface CommentRepository {
  getComments(postId: string): CommentItem[];
  saveComments(postId: string, comments: CommentItem[]): void;
}
