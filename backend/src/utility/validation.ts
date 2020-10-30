import * as Joi from "@hapi/joi";

export const validateBaseModel = (baseModel: any) => {
  const schema = Joi.object({
    createdAt: Joi.date().timestamp(),
    updatedAt: Joi.date().timestamp(),
    deleteFlag: Joi.string().valid("A", "NA", "T").trim().required(),
    createdBy: Joi.number().required(),
    updatedBy: Joi.number().required(),
    comments: Joi.string().trim().allow("", null),
  });
  return schema.validate(baseModel);
};

export const validateProduct = (product: any, add: Boolean = true) => {
  if (add) {
    const schema = Joi.object({
      name: Joi.string().trim().min(5).max(255).required(),
      stockCount: Joi.number().min(0).max(1000).required().strict(),
      dailyRentalRate: Joi.number().min(0).max(1000).required().strict(),
      productCategories: Joi.array().items(
        Joi.object({ categoryId: Joi.number().positive().required().strict() })
      ),
      productLocations: Joi.array().items(
        Joi.object({ locationId: Joi.number().positive().required().strict() })
      ),
    });
    return schema.validate(product);
  } else {
    const schema = Joi.object({
      productId: Joi.number().positive().required().strict(),
      name: Joi.string().trim().min(5).max(255).required(),
      stockCount: Joi.number().min(0).max(1000).required().strict(),
      dailyRentalRate: Joi.number().min(0).max(1000).required().strict(),
      productCategories: Joi.array().items(
        Joi.object({
          categoryId: Joi.number().positive().optional().strict(),
        })
      ),
      productLocations: Joi.array().items(
        Joi.object({
          locationId: Joi.number().positive().optional().strict(),
        })
      ),
    });
    return schema.validate(product);
  }
};

export const validateCategory = (category: any, add: Boolean = true) => {
  if (add) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(255).trim().required(),
    });
    return schema.validate(category);
  } else {
    const schema = Joi.object({
      categoryId: Joi.number().positive().required().strict(),
      name: Joi.string().min(3).max(255).trim().required(),
    });
    return schema.validate(category);
  }
};

export const validateLocation = (location: any, add: Boolean = true) => {
  if (add) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(255).trim().required(),
    });
    return schema.validate(location);
  } else {
    const schema = Joi.object({
      locationId: Joi.number().positive().required().strict(),
      name: Joi.string().min(3).max(255).trim().required(),
    });
    return schema.validate(location);
  }
};

export const validatePhone = (phone: any, add: Boolean = true) => {
  if (add) {
    let schema = Joi.object({
      phoneNumber: Joi.string().trim().required(),
      userId: Joi.number().positive().required().strict(),
    });
    return schema.validate(phone);
  } else {
    let schema = Joi.object({
      phoneId: Joi.number().positive().required().strict(),
      phoneNumber: Joi.string().trim().required(),
      userId: Joi.number().positive().required().strict(),
    });
    return schema.validate(phone);
  }
  // let schema = Joi.object({
  //   phoneId: Joi.alternatives().conditional(add, {
  //     is: true,
  //     then: Joi.allow(null).invalid("null"),
  //     otherwise: Joi.number().positive().required().default("value"),
  //   }),
  //   phoneNumber: Joi.string().trim().required(),
  //   userId: Joi.number().positive().required(),
  // });
  // return schema.validate(phone);
};

export const validateOrder = (order: any, add: Boolean = true) => {
  if (add) {
    const schema = Joi.object({
      userId: Joi.number().positive().required().strict(),
      rentals: Joi.array().items(
        Joi.object({
          dateOut: Joi.date().required(),
          dateReturned: Joi.date().required(),
          productId: Joi.number().positive().required().strict(),
        })
      ),
    });
    return schema.validate(order);
  } else {
    const schema = Joi.object({
      orderId: Joi.number().positive().required().strict(),
      userId: Joi.number().positive().required().strict(),
      rentals: Joi.array().items(
        Joi.object({
          rentalId: Joi.number().positive().optional().strict(),
          dateOut: Joi.date().required(),
          dateReturned: Joi.date().required(),
          productId: Joi.number().positive().required().strict(),
        })
      ),
    });
    return schema.validate(order);
  }
};

export const validateUser = (user: any, add: Boolean = true) => {
  if (add) {
    const schema = Joi.object({
      userName: Joi.string().trim().min(3).max(255).required(),
      email: Joi.string().email().trim().required(),
      password: Joi.string().trim().required(),
      role: Joi.string().valid("Admin", "Customer").required(),
    });
    return schema.validate(user);
  } else {
    const schema = Joi.object({
      userId: Joi.number().positive().required().strict(),
      userName: Joi.string().trim().min(3).max(255).required(),
      email: Joi.string().email().trim().required(),
      password: Joi.string().trim().required(),
      role: Joi.string().valid("Admin", "Customer").required(),
    });
    return schema.validate(user);
  }
};

export const validateLogIn = (logIn: any) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().trim().required(),
  });
  return schema.validate(logIn);
};
