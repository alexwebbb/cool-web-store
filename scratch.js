const total = user.current_cart.reduce((a, c) => {
    return a + c.quantity * c.item.price;
  }, 0),
  totalTimes100 = total * 100,
  newCart = user.current_cart.map(function(element) {
    const item = element.item;
    return {
      item: {
        name: item.name,
        description: item.description,
        price: item.price,
        img_100: item.img_100,
        img_700_400: item.img_700_400,
        item_groups: item.item_groups,
        id: item._id
      },
      quantity: element.quantity
    };
  }),