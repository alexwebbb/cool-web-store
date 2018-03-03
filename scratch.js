// ok to calculate the total we first need to calculate the price of each item after discount
// so basically we need to add an extra field to each item. something like "adjusted price"
// so for each itemm we must have
// + element.quantity
// + item.price
// + item.item_groups
// + user.active_coupons
// + coupon.valid_item_groups
// + coupon.discount_percent

let quantity = element.quantity,
    price = item.price,
    item_groups = item.item_groups,
    active_coupons = user.active_coupons,
    valid_groups = coupon.valid_item_groups,
    discount = coupon.discount_percent;


foreach item in items
    item.cumulative_discount = 0;
    foreach group in item.item_groups
        foreach coupon in user.active_coupons
            foreach valid_group in coupon.valid_groups
                if group === valid_group
                    item.cumulative_discount + coupon.discount_percent;



