import briefcaseBusinessIcon from '@/assets/icons/briefcase-business.png'
import carFrontIcon from '@/assets/icons/car-front.png'
import piggyBankIcon from '@/assets/icons/piggy-bank.png'
import shoppingCartIcon from '@/assets/icons/shopping-cart.png'
import ticketIcon from '@/assets/icons/ticket.png'
import toolCaseIcon from '@/assets/icons/tool-case.png'
import utensilsIcon from '@/assets/icons/utensils.png'
import bookIcon from '@/assets/icons/book.png'
import dumbbellIcon from '@/assets/icons/dumbbell.png'
import giftIcon from '@/assets/icons/gift.png'
import heartIcon from '@/assets/icons/heart.png'
import homeIcon from '@/assets/icons/home.png'

export type IconVariant = 'baggage'
| 'book'
| 'business'
| 'car'
| 'dumbbell'
| 'gift'
| 'heart'
| 'home'
| 'piggy-bank'
| 'shopping-cart'
| 'ticket'
| 'tool-case'
| 'utensils'


export const getCategoryIconMap = (icon: IconVariant) => {
    const map: Record<IconVariant, string> = {
        baggage: briefcaseBusinessIcon,
        book: bookIcon,
        business: briefcaseBusinessIcon,
        car: carFrontIcon,
        dumbbell: dumbbellIcon,
        gift: giftIcon,
        heart: heartIcon,
        home: homeIcon,
        'piggy-bank': piggyBankIcon,
        'shopping-cart': shoppingCartIcon,
        ticket: ticketIcon,
        'tool-case': toolCaseIcon,
        utensils: utensilsIcon,
    }
    return map[icon] ?? ''
}