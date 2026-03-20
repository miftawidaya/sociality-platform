'use client';

import * as React from 'react';
import { Grid3, Archive, Heart } from 'iconsax-react';
import { ProfileHeader, ProfileStats } from '../profile-header';
import { PageHeader } from '@/components/layouts/header/PageHeader';
import { ProfileTabs, ProfileTabItem, ProfileTabId } from './ProfileTabs';
import { ProfileGallery } from '../profile-gallery';
import type { ProfileResponse } from '../../types/profile.types';
import {
  useUserPosts,
  useSavedPosts,
  useUserLikes,
  useUserProfile,
} from '../../queries/profile.queries';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

type ProfileLayoutProps = Readonly<{
  data: ProfileResponse;
  isOwner: boolean;
}>;

export function ProfileLayout({ data: initialData, isOwner }: ProfileLayoutProps) {
  const { data: profileData } = useUserProfile(initialData.profile.username);
  const data = profileData ?? initialData;

  const [activeTab, setActiveTab] = React.useState<ProfileTabId>('posts');

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const tabs: ProfileTabItem[] = [];

  if (isOwner) {
    tabs.push(
      { id: 'posts', label: 'Gallery', icon: Grid3 },
      { id: 'saved', label: 'Saved', icon: Archive },
      { id: 'likes', label: 'Liked', icon: Heart }
    );
  } else {
    tabs.push(
      { id: 'posts', label: 'Gallery', icon: Grid3 },
      { id: 'likes', label: 'Liked', icon: Heart }
    );
  }

  const postsQuery = useUserPosts(data.profile.username);

  const savedQuery = useSavedPosts(
    isAuthenticated && isOwner && activeTab === 'saved',
    9
  );

  // Hook 3: Liked posts
  const likesQuery = useUserLikes(
    data.profile.username,
    activeTab === 'likes',
    9
  );

  let currentQuery;
  if (activeTab === 'posts') {
    currentQuery = postsQuery;
  } else if (activeTab === 'saved') {
    currentQuery = savedQuery;
  } else if (activeTab === 'likes') {
    currentQuery = likesQuery;
  } else {
    currentQuery = {
      data: { pages: [{ posts: [] }] },
      isLoading: false,
      isError: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: () => {},
    };
  }

  let emptyMessage: string;
  if (activeTab === 'posts') {
    emptyMessage = 'No posts yet.';
  } else if (activeTab === 'saved') {
    emptyMessage = 'You have not saved any posts.';
  } else {
    emptyMessage = 'No posts found.';
  }

  return (
    <>
      <PageHeader
        title={isOwner ? 'My Profile' : data.profile.name}
        backTo='/'
        className='md:hidden'
      />
      <div className='custom-container flex max-w-215 flex-col items-start gap-4 pt-6 pb-24 md:gap-6 md:pt-10'>
        <div className='flex w-full flex-col gap-4 md:gap-6'>
          <ProfileHeader user={data.profile} isOwner={isOwner} />

          {data.profile.bio && (
            <p className='text-foreground text-sm-regular md:text-md-regular tracking-[-0.02em]'>
              {data.profile.bio}
            </p>
          )}

          <ProfileStats stats={data.stats} username={data.profile.username} />
        </div>

        <div className='mt-2 flex w-full flex-col md:mt-6'>
          <ProfileTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <ProfileGallery
            data={currentQuery.data}
            isLoading={currentQuery.isLoading}
            isError={currentQuery.isError}
            hasNextPage={!!currentQuery.hasNextPage}
            isFetchingNextPage={currentQuery.isFetchingNextPage}
            fetchNextPage={currentQuery.fetchNextPage}
            emptyMessage={emptyMessage}
            isOwner={isOwner}
            activeTab={activeTab}
          />
        </div>
      </div>
    </>
  );
}
