import { cn } from '@/lib/utils';
import { Container } from './container';
import React from 'react';
import Image from 'next/image';
import {Button} from '../ui';
import {User} from "lucide-react";
import Link from 'next/link';
import { SearchInput } from './search-input';
import { CartButton } from './cart-button';

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn('border border-b',className)}>
      <Container className='flex items-center justify-between py-8'>

        {/* Левая часть */}
       <Link href="/">
        <div className="flex item-center gap-4">
              <Image src="/logo.png" alt="Logo" width={50} height={40}/>
              <div>
                <h1 className="text-2xl uppercase font-black">Empire Sneakers</h1>
                <p className="text-sm text-gray-400 leading-3">Лучше уже некуда</p>
              </div>
          </div>
       </Link>

      <div className="mx-10 flex-1">
        <SearchInput/>
      </div>
        {/* Правая часть */}

        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-1">
            <User size={16}/>
            Войти
          </Button>

          <CartButton/>
        </div>
      </Container>
    </div>
  );
};