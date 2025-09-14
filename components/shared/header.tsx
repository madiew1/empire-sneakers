import { cn } from '@/lib/utils';
import { Container } from './container';
import React from 'react';
import Image from 'next/image';
import {Button} from '../ui';
import {User, ShoppingCart, ArrowRight} from "lucide-react";

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn('border border-b',className)}>
      <Container className='flex items-center justify-between py-8'>

        {/* Левая часть */}
        <div className="flex item-center gap-4">
            <Image src="/logo.png" alt="Logo" width={50} height={40}/>
            <div>
              <h1 className="text-2xl uppercase font-black">Empire Sneakers</h1>
              <p className="text-sm text-gray-400 leading-3">Лучше уже некуда</p>
            </div>
        </div>

        {/* Правая часть */}

        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-1">
            <User size={16}/>
            Войти
          </Button>

          <div>
            <Button className="group realitive">
              <b>520 ₽</b>
              <span className="h-full w-[1px] bg-white/30 mx-3" />
              <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
                <ShoppingCart size={16} className="relative" strokeWidth={2} />
                <b>3</b>
              </div>
              <ArrowRight size={20} className="absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};