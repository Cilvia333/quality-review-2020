import _ from 'lodash';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import tw from 'twin.macro';

import Heart from '../assets/svgs/heart.svg';
import HeartOutline from '../assets/svgs/heart_outline.svg';

import { ArticleData } from '~/data';
import { media } from '~/styles';
import { HSV, Info } from '~/types';
import { rgb2hsv } from '~/util/index';

interface Props {
  info?: Info;
  id?: string;
}

const Card: React.FC<Props> = (props) => {
  const { id } = props;
  const [defColor, setDefColor] = useState<HSV>({ h: 0, s: 0, v: 0 });
  const [tileColors, setTileColors] = useState<HSV[]>([]);
  const [clicked, isClicked] = useState(false);
  const [item, setItem] = useState<Info>();

  useEffect(() => {
    const article = _.get(ArticleData, `${id}`);
    if (article) {
      setItem(article);
    }
  }, [id]);

  useEffect(() => {
    if (!item) {
      return;
    }

    const [h, s, v] = rgb2hsv([
      item.color?.r ?? 0,
      item.color?.g ?? 0,
      item.color?.b ?? 0,
    ]);

    setDefColor({ h, s, v });

    const colors: HSV[] = [];
    for (let i = 0; i < 6; i++) {
      const converedS = (s / 5) * i;
      const converedV = 100 - (v / 5) * i;
      colors.push({ h, s: converedS, v: converedV });
    }

    const colorArray: HSV[] = [];

    for (let i = 0; i < 168; i++) {
      colorArray.push(colors[Math.floor(Math.random() * Math.floor(6))]);
    }

    setTileColors(colorArray);
  }, [item]);

  return (
    <Wrapper>
      <PostWrapper>
        <IconImg src={require(`images/${id}/icon.png`)} />
        <ContentWrapper>
          <Name>
            {item?.name ?? ''}
            <Id>@{item?.id ?? ''}</Id>
          </Name>
          <Description>{item?.description ?? ''}</Description>
          <ReadMore>
            <Link href={'/[id]'} as={`${id}`}>
              read more ...
            </Link>
          </ReadMore>
          <Link href={'/[id]'} as={`${id}`}>
            <ThumbnailWrapper>
              <ThumbnailImg src={require(`images/${id}/thumbnail.png`)} />
            </ThumbnailWrapper>
          </Link>
        </ContentWrapper>
      </PostWrapper>
      <ButtonWrapper>
        <StyledHeartOutline
          isActive={!clicked}
          onClick={() => isClicked(true)}
        />
        <StyledHeart isActive={clicked} color={defColor} />
      </ButtonWrapper>
      <Footer>
        {tileColors.map((color, index) => (
          <BGTile color={color} key={`tile_${index}`} />
        ))}
      </Footer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  ${tw`relative m-4 bg-gray-100 overflow-hidden`}
  width: 420px;
  border-radius: 16px;
`;

const PostWrapper = styled.div`
  ${tw`p-8 flex flex-row items-start`}

  ${media.md`
    ${tw`flex-col`}
  `}

  ${media.sm`
    ${tw`p-4`}
  `}
`;

const IconImg = styled.img`
  ${tw`h-12 w-12 object-cover rounded-full`}

  ${media.md`
    ${tw`mb-8 h-16 w-16`}
  `}

  ${media.sm`
    ${tw`mb-8`}
  `}
`;

const ContentWrapper = styled.div`
  ${tw`pb-4 pl-4`}

  ${media.md`
    ${tw`pl-0`}
  `}
`;

const Name = styled.h2`
  ${tw`m-0 text-xl font-bold leading-none`}
`;

const Id = styled.span`
  ${tw`ml-2 text-sm text-gray-600 font-bold leading-none`}
`;

const Description = styled.div`
  ${tw`py-4 text-base`}

  ${media.sm`
    ${tw`text-sm`}
  `}
`;

const ReadMore = styled.div`
  ${tw`text-red-500 text-base no-underline`}
`;

const ThumbnailImg = styled.img`
  ${tw`relative h-full w-full object-cover transition-all duration-500 ease-in-out cursor-pointer`}

  transform: scale(1);
`;

const ThumbnailWrapper = styled.div`
  ${tw`my-4 text-xl overflow-hidden`}
  border-radius: 16px;
  height: 200px;

  &:hover {
    ${ThumbnailImg} {
      transform: scale(1.05);
    }
  }
`;

const StyledHeartOutline = styled(HeartOutline)<{ isActive: boolean }>`
  ${tw`absolute h-full w-full transition-all duration-500 ease-in-out cursor-pointer opacity-0`}

  stroke-width: 2px;
  transform: scale(1);

  ${({ isActive }) =>
    isActive &&
    css`
      ${tw`opacity-100`}
    `}
`;

const StyledHeart = styled(Heart)<{ isActive: boolean; color: any }>`
  ${tw`absolute h-full w-full transition-all duration-300 ease-in-out cursor-pointer fill-current opacity-0`}

  stroke-width: 2px;
  transform: scale(0.1);

  ${({ isActive }) =>
    isActive &&
    css`
      ${tw`opacity-100`}
      transform: scale(1);
    `}

  ${({ color }) => css`
    color: hsl(${color.h}, ${color.s}%, ${color.v}%);
  `}
`;

const ButtonWrapper = styled.div`
  ${tw`absolute h-8 w-8 z-10`}
  bottom: 3rem;
  right: 1rem;
  &:hover {
    ${StyledHeartOutline} {
      transform: scale(1.2);
    }
  }
`;

const Footer = styled.div`
  ${tw`flex flex-wrap`}
  height: 40px;
  bottom: -40px;
`;

const BGTile = styled.div<{ color: any }>`
  ${tw`relative bg-gray-500`}
  height: 10px;
  width: 10px;

  ${({ color }) => css`
    background-color: hsl(${color.h}, ${color.s}%, ${color.v}%);
  `}
`;

export default Card;
