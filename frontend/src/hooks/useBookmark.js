import React from 'react'
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { addToBookmarkService } from '../services/addToBookmarkService';

function useBookmark() {

    const BookmarkMutation = useMutation(addToBookmarkService, {
        onSuccess: (data) => {
          toast.success(data?.message);
        },
        onError: (error) => {
          console.log(error);
          toast.error(
            error?.response?.data?.message || "An unexpected error occurred"
          );
        },
      })
    
      const handleBookmark = async (pollId) => {
        BookmarkMutation.mutate(pollId);
      }


    return {handleBookmark, BookmarkMutation};
}

export default useBookmark
