"use server";

// DB
import { db } from "@/lib/db";
// import {
//   CountryWithShippingRatesType,
//   shopDefaultShippingType,
//   shopStatus,
//   shopType,
// } from "@/lib/types";

// Clerk
import { currentUser } from "@clerk/nextjs/server";

// Prisma models
import {  Shop } from "@/generated/client";
// import { checkIfUserFollowingshop } from "./product";
import { userAgent } from "next/server";

// Function: upsertshop
// Description: Upserts shop details into the database, ensuring uniqueness of name,url, email, and phone number.
// Access Level: Seller Only
// Parameters:
//   - shop: Partial shop object containing details of the shop to be upserted.
// Returns: Updated or newly created shop details.
export const upsertShop = async (shop: Partial<Shop>) => {
  try {
    // Get current user
    const user = await currentUser();

    // Ensure user is authenticated
    if (!user) throw new Error("Unauthenticated.");

    // Verify seller permission
    if (user.privateMetadata.role !== "SELLER")
      throw new Error(
        "Unauthorized Access: Seller Privileges Required for Entry."
      );

    // Ensure shop data is provided
    if (!shop) throw new Error("Please provide shop data.");

    // Check if shop with same name, email,url, or phone number already exists
    const existingshop = await db.shop.findFirst({
      where: {
        AND: [
          {
            OR: [
              { name: shop.name },
              { email: shop.email },
              { phone: shop.phone },
              { url: shop.url },
            ],
          },
          {
            NOT: {
              id: shop.id,
            },
          },
        ],
      },
    });

    // If a shop with same name, email, or phone number already exists, throw an error
    if (existingshop) {
      let errorMessage = "";
      if (existingshop.name === shop.name) {
        errorMessage = "A shop with the same name already exists";
      } else if (existingshop.email === shop.email) {
        errorMessage = "A shop with the same email already exists";
      } else if (existingshop.phone === shop.phone) {
        errorMessage = "A shop with the same phone number already exists";
      } else if (existingshop.url === shop.url) {
        errorMessage = "A shop with the same URL already exists";
      }
      throw new Error(errorMessage);
    }

    // Upsert shop details into the database
    const shopDetails = await db.shop.upsert({
      where: {
        id: shop.id,
      },
      update: shop,
      create: {
        ...shop,
        user: {
          connect: { id: user.id },
        },
      },
    });

    return shopDetails;

  } catch (error) {
    throw error;
  }
};

// // Function: getshopDefaultShippingDetails
// // Description: Fetches the default shipping details for a shop based on the shop URL.
// // Parameters:
// //   - shopUrl: The URL of the shop to fetch default shipping details for.
// // Returns: An object containing default shipping details, including shipping service, fees, delivery times, and return policy.
// export const getshopDefaultShippingDetails = async (shopUrl: string) => {
//   try {
//     // Ensure the shop URL is provided
//     if (!shopUrl) throw new Error("shop URL is required.");

//     // Fetch the shop and its default shipping details
//     const shop = await db.shop.findUnique({
//       where: {
//         url: shopUrl,
//       },
//       select: {
//         defaultShippingService: true,
//         defaultShippingFeePerItem: true,
//         defaultShippingFeeForAdditionalItem: true,
//         defaultShippingFeePerKg: true,
//         defaultShippingFeeFixed: true,
//         defaultDeliveryTimeMin: true,
//         defaultDeliveryTimeMax: true,
//         returnPolicy: true,
//       },
//     });

//     // Throw an error if the shop is not found
//     if (!shop) throw new Error("shop not found.");

//     return shop;
//   } catch (error) {
//     // Log and re-throw any errors
//     throw error;
//   }
// };

// // Function: updateshopDefaultShippingDetails
// // Description: Updates the default shipping details for a shop based on the shop URL.
// // Parameters:
// //   - shopUrl: The URL of the shop to update.
// //   - details: An object containing the new shipping details (shipping service, fees, delivery times, and return policy).
// // Returns: The updated shop object with the new default shipping details.
// export const updateshopDefaultShippingDetails = async (
//   shopUrl: string,
//   details: shopDefaultShippingType
// ) => {
//   try {
//     // Get current user
//     const user = await currentUser();

//     // Ensure user is authenticated
//     if (!user) throw new Error("Unauthenticated.");

//     // Verify seller permission
//     if (user.privateMetadata.role !== "SELLER")
//       throw new Error(
//         "Unauthorized Access: Seller Privileges Required for Entry."
//       );

//     // Ensure the shop URL is provided
//     if (!shopUrl) throw new Error("shop URL is required.");

//     // Ensure at least one detail is provided for update
//     if (!details) {
//       throw new Error("No shipping details provided to update.");
//     }
//     // Make sure seller is updating their own shop
//     const check_ownership = await db.shop.findUnique({
//       where: {
//         url: shopUrl,
//         userId: user.id,
//       },
//     });

//     if (!check_ownership)
//       throw new Error(
//         "Make sure you have the permissions to update this shop"
//       );

//     // Find and update the shop based on shopUrl
//     const updatedshop = await db.shop.update({
//       where: {
//         url: shopUrl,
//         userId: user.id,
//       },
//       data: details,
//     });

//     return updatedshop;
//   } catch (error) {
//     // Log and re-throw any errors
//     throw error;
//   }
// };

// /**
//  * Function: getshopShippingRates
//  * Description: Retrieves all countries and their shipping rates for a specific shop.
//  *              If a country does not have a shipping rate, it is still included in the result with a null shippingRate.
//  * Permission Level: Public
//  * Returns: Array of objects where each object contains a country and its associated shippingRate, sorted by country name.
//  */
// export const getshopShippingRates = async (shopUrl: string) => {
//   try {
//     // Get current user
//     const user = await currentUser();

//     // Ensure user is authenticated
//     if (!user) throw new Error("Unauthenticated.");

//     // Verify seller permission
//     if (user.privateMetadata.role !== "SELLER")
//       throw new Error(
//         "Unauthorized Access: Seller Privileges Required for Entry."
//       );

//     // Ensure the shop URL is provided
//     if (!shopUrl) throw new Error("shop URL is required.");

//     // Make sure seller is updating their own shop
//     const check_ownership = await db.shop.findUnique({
//       where: {
//         url: shopUrl,
//         userId: user.id,
//       },
//     });

//     if (!check_ownership)
//       throw new Error(
//         "Make sure you have the permissions to update this shop"
//       );

//     // Get shop details
//     const shop = await db.shop.findUnique({
//       where: { url: shopUrl, userId: user.id },
//     });

//     if (!shop) throw new Error("shop could not be found.");

//     // Retrieve all countries
//     const countries = await db.country.findMany({
//       orderBy: {
//         name: "asc",
//       },
//     });

//     // Retrieve all shipping rates for the specified shop
//     const shippingRates = await db.shippingRate.findMany({
//       where: {
//         shopId: shop.id,
//       },
//     });

//     // Create a map for quick lookup of shipping rates by country ID
//     const rateMap = new Map();
//     shippingRates.forEach((rate) => {
//       rateMap.set(rate.countryId, rate);
//     });

//     // Map countries to their shipping rates
//     const result = countries.map((country) => ({
//       countryId: country.id,
//       countryName: country.name,
//       shippingRate: rateMap.get(country.id) || null,
//     }));

//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

// // Function: upsertShippingRate
// // Description: Upserts a shipping rate for a specific country, updating if it exists or creating a new one if not.
// // Permission Level: Seller only
// // Parameters:
// //   - shopUrl: Url of the shop you are trying to update.
// //   - shippingRate: ShippingRate object containing the details of the shipping rate to be upserted.
// // Returns: Updated or newly created shipping rate details.
// export const upsertShippingRate = async (
//   shopUrl: string,
//   shippingRate: ShippingRate
// ) => {
//   try {
//     // Get current user
//     const user = await currentUser();

//     // Ensure user is authenticated
//     if (!user) throw new Error("Unauthenticated.");

//     // Verify seller permission
//     if (user.privateMetadata.role !== "SELLER")
//       throw new Error(
//         "Unauthorized Access: Seller Privileges Required for Entry."
//       );

//     // Make sure seller is updating their own shop
//     const check_ownership = await db.shop.findUnique({
//       where: {
//         url: shopUrl,
//         userId: user.id,
//       },
//     });

//     if (!check_ownership)
//       throw new Error(
//         "Make sure you have the permissions to update this shop"
//       );

//     // Ensure shipping rate data is provided
//     if (!shippingRate) throw new Error("Please provide shipping rate data.");

//     // Ensure countryId is provided
//     if (!shippingRate.countryId)
//       throw new Error("Please provide a valid country ID.");

//     // Get shop id
//     const shop = await db.shop.findUnique({
//       where: {
//         url: shopUrl,
//         userId: user.id,
//       },
//     });
//     if (!shop) throw new Error("Please provide a valid shop URL.");

//     // Upsert the shipping rate into the database
//     const shippingRateDetails = await db.shippingRate.upsert({
//       where: {
//         id: shippingRate.id,
//       },
//       update: { ...shippingRate, shopId: shop.id },
//       create: { ...shippingRate, shopId: shop.id },
//     });

//     return shippingRateDetails;
//   } catch (error) {
//     // Log and re-throw any errors
//     throw error;
//   }
// };

// /**
//  * @name getshopOrders
//  * @description - Retrieves all orders for a specific shop.
//  *              - Returns order that include items, order details.
//  * @access User
//  * @param shopUrl - The url of the shop whose order groups are being retrieved.
//  * @returns {Array} - Array of order groups, including items.
//  */
// export const getshopOrders = async (shopUrl: string) => {
//   try {
//     // Retrieve current user
//     const user = await currentUser();

//     // Check if user is authenticated
//     if (!user) throw new Error("Unauthenticated.");

//     // Verify seller permission
//     if (user.privateMetadata.role !== "SELLER")
//       throw new Error(
//         "Unauthorized Access: Seller Privileges Required for Entry."
//       );

//     // Get shop id using url
//     const shop = await db.shop.findUnique({
//       where: {
//         url: shopUrl,
//       },
//     });

//     // Ensure shop existence
//     if (!shop) throw new Error("shop not found.");

//     // Verify ownership
//     if (user.id !== shop.userId) {
//       throw new Error("You don't have persmission to access this shop.");
//     }

//     // Retrieve order groups for the specified shop and user
//     const orders = await db.orderGroup.findMany({
//       where: {
//         shopId: shop.id,
//       },
//       include: {
//         items: true,
//         coupon: true,
//         order: {
//           select: {
//             paymentStatus: true,

//             shippingAddress: {
//               include: {
//                 country: true,
//                 user: {
//                   select: {
//                     email: true,
//                   },
//                 },
//               },
//             },
//             paymentDetails: true,
//           },
//         },
//       },
//       orderBy: {
//         updatedAt: "desc",
//       },
//     });

//     return orders;
//   } catch (error) {
//     throw error;
//   }
// };

// export const applySeller = async (shop: shopType) => {
//   try {
//     // Get current user
//     const user = await currentUser();

//     // Ensure user is authenticated
//     if (!user) throw new Error("Unauthenticated.");

//     // Ensure shop data is provided
//     if (!shop) throw new Error("Please provide shop data.");

//     // Check if shop with same name, email,url, or phone number already exists
//     const existingshop = await db.shop.findFirst({
//       where: {
//         AND: [
//           {
//             OR: [
//               { name: shop.name },
//               { email: shop.email },
//               { phone: shop.phone },
//               { url: shop.url },
//             ],
//           },
//         ],
//       },
//     });

//     // If a shop with same name, email, or phone number already exists, throw an error
//     if (existingshop) {
//       let errorMessage = "";
//       if (existingshop.name === shop.name) {
//         errorMessage = "A shop with the same name already exists";
//       } else if (existingshop.email === shop.email) {
//         errorMessage = "A shop with the same email already exists";
//       } else if (existingshop.phone === shop.phone) {
//         errorMessage = "A shop with the same phone number already exists";
//       } else if (existingshop.url === shop.url) {
//         errorMessage = "A shop with the same URL already exists";
//       }
//       throw new Error(errorMessage);
//     }

//     // Upsert shop details into the database
//     const shopDetails = await db.shop.create({
//       data: {
//         ...shop,
//         defaultShippingService:
//           shop.defaultShippingService || "International Delivery",
//         returnPolicy: shop.returnPolicy || "Return in 30 days.",
//         userId: user.id,
//       },
//     });

//     return shopDetails;
//   } catch (error) {
//     throw error;
//   }
// };

// // Function: getAllshops
// // Description: Retrieves all shops from the database.
// // Permission Level: Admin only
// // Parameters: None
// // Returns: An array of shop details.
// export const getAllshops = async () => {
//   try {
//     // Get current user
//     const user = await currentUser();

//     // Ensure user is authenticated
//     if (!user) throw new Error("Unauthenticated.");

//     // Verify admin permission
//     if (user.privateMetadata.role !== "ADMIN") {
//       throw new Error(
//         "Unauthorized Access: Admin Privileges Required to View shops."
//       );
//     }

//     // Fetch all shops from the database
//     const shops = await db.shop.findMany({
//       include: {
//         user: true,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//     return shops;
//   } catch (error) {
//     // Log and re-throw any errors
//     throw error;
//   }
// };

// export const updateshopStatus = async (
//   shopId: string,
//   status: shopStatus
// ) => {
//   // Retrieve current user
//   const user = await currentUser();

//   // Check if user is authenticated
//   if (!user) throw new Error("Unauthenticated.");

//   // Verify admin permission
//   if (user.privateMetadata.role !== "ADMIN")
//     throw new Error(
//       "Unauthorized Access: Admin Privileges Required for Entry."
//     );

//   const shop = await db.shop.findUnique({
//     where: {
//       id: shopId,
//     },
//   });

//   // Verify seller ownership
//   if (!shop) {
//     throw new Error("shop not found !");
//   }

//   // Retrieve the order to be updated
//   const updatedshop = await db.shop.update({
//     where: {
//       id: shopId,
//     },
//     data: {
//       status,
//     },
//   });

//   // Update the user role
//   if (shop.status === "PENDING" && updatedshop.status === "ACTIVE") {
//     await db.user.update({
//       where: {
//         id: updatedshop.userId,
//       },
//       data: {
//         role: "SELLER",
//       },
//     });
//   }

//   return updatedshop.status;
// };

// // Function: deleteshop
// // Description: Deletes a shop from the database.
// // Permission Level: Admin only
// // Parameters:
// //   - shopId: The ID of the shop to be deleted.
// // Returns: Response indicating success or failure of the deletion operation.
// export const deleteshop = async (shopId: string) => {
//   try {
//     // Get current user
//     const user = await currentUser();

//     // Check if user is authenticated
//     if (!user) throw new Error("Unauthenticated.");

//     // Verify admin permission
//     if (user.privateMetadata.role !== "ADMIN")
//       throw new Error(
//         "Unauthorized Access: Admin Privileges Required for Entry."
//       );

//     // Ensure shop ID is provided
//     if (!shopId) throw new Error("Please provide shop ID.");

//     // Delete shop from the database
//     const response = await db.shop.delete({
//       where: {
//         id: shopId,
//       },
//     });

//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getshopPageDetails = async (shopUrl: string) => {
//   const user = await currentUser();

//   // Fetch the shop details from the database
//   const shop = await db.shop.findUnique({
//     where: {
//       url: shopUrl,
//       status: "ACTIVE",
//     },
//     select: {
//       id: true,
//       name: true,
//       description: true,
//       logo: true,
//       cover: true,
//       averageRating: true,
//       numReviews: true,
//       _count: {
//         select: {
//           followers: true,
//         },
//       },
//     },
//   });
//   let isUserFollowingshop = false;
//   if (user && shop) {
//     isUserFollowingshop = await checkIfUserFollowingshop(shop.id, user.id);
//   }
//   // Handle case where the shop is not found
//   if (!shop) {
//     throw new Error(`shop with URL "${shopUrl}" not found.`);
//   }
//   return { ...shop, isUserFollowingshop };
// };
