const Ads = require("../models/Property");
const User = require("../models/User");

exports.create = (req, res, next) => {
  try {
    const { owner } = req.body;
    const images = [];
    const _images = req.files.property_image;
    _images.forEach((image) => {
      images.push(image.filename);
    });
    let payload = null;
    if (!owner) {
      payload = {
        ...req.body,
        owner: req.userId,
        estate: req.userId,
        images,
      };
    } else {
      payload = {
        ...req.body,
        owner: req.userId,
        estate: owner,
        // estate
        images,
      };
    }
    Ads.create(payload).then((ad) => {
      res.status(200).json({
        message:
          "Ad Created successfully! \n Your ad will be published after admin approval.",
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.editProperty = (req, res, next) => {
  try {
    const { propertyId } = req.body;
    console.log(req.body);
    const images = [];

    const _images = req.files.property_image;
    _images.forEach((img) => {
      images.push(img.filename);
    });

    if (req.body.prevImages === "undefined") {
      // let images2 = [...images];
      //     console.log(images2);
      Ads.findByIdAndUpdate(
        propertyId,
        {
          ...req.body,
          images: [...images],
        },
        { new: true }
      ).then(() => {
        res.status(200).json({
          message: "Property Updated Successfully",
        });
      });
    } else {
      let parsedImages = JSON.parse(req.body.prevImages);
      let images2 = [...images, ...parsedImages];
      console.log(images2);
      Ads.findByIdAndUpdate(
        propertyId,
        {
          ...req.body,
          images: [...images, ...parsedImages],
        },
        { new: true }
      ).then(() => {
        res.status(200).json({
          message: "Property Updated Successfully",
        });
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.getAll = (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;

    console.log("94", req.query);

    const city =
      req.query.city !== "undefined"
        ? {
            city: req.query.city,
          }
        : {};
    const category =
      req.query.category !== "undefined"
        ? {
            propertyType: req.query.category,
          }
        : {};

    // const price =
    //   req.query.min !== "undefined"
    //     ? {
    //         price: {
    //           $lte: req.query.min,
    //           $gte: req.query.max,
    //         },
    //       }
    //     : {};

    Ads.find({
      expired: false,
      rejected: false,
      approved: false,
      ...city,
      ...category,
      // ...price,
    })
      .populate("owner city")
      .skip(page * perPage - perPage)
      .limit(perPage)
      .then((ads) => {
        Ads.find({
          expired: false,
          rejected: false,
          approved: false,
          ...city,
          ...category,
          // ...price,
        })
          .countDocuments()
          .then((docs) => {
            res.status(200).json({
              ads,
              page: page,
              limit: perPage,
              totalPages: Math.ceil(docs / perPage),
              totalDocs: docs,
            });
          });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.getProperty = (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    Ads.findById(id)
      .populate("owner city")
      .then((ads) => {
        res.status(200).json(ads);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.getPropertiesByCity = (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    Ads.find({ city: id })
      .populate("city user")
      .then((ads) => {
        res.status(200).json(ads);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.getPropertiesByCategory = async (req, res, next) => {
  try {
    const featured = await Ads.find({ featured: false }).populate("city owner");
    const hot = await Ads.find({ hot: false }).populate("city owner");
    const trending = await Ads.find({ trending: false }).populate("city owner");

    res.status(200).json({
      featured,
      hot,
      trending,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.getAllAdsAdmin = (req, res, next) => {
  try {
    Ads.find({ expired: false, rejected: false })
      .populate("user")
      .then((active) => {
        Ads.find({ expired: true, rejected: false })
          .populate("user")
          .then((expired) => {
            Ads.find({ rejected: true })
              .populate("user")
              .then((rejected) => {
                res.status(200).json({
                  current: active,
                  previous: expired,
                  rejected: rejected,
                });
              });
          });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.getRecentProperties = async (req, res, next) => {
  try {
    let count = 0;
    User.findById(req.userId).then((vendor) => {
      if (!vendor.owner) {
        Ads.find({
          estate: req.userId,
          expired: false,
        })
          .populate("owner estate city")
          .then((props) => {
            res.status(200).json({
              recent: props,
            });
          });
      } else {
        Ads.find({
          owner: req.userId,
          expired: false,
        })
          .populate("owner estate city")
          .then((props) => {
            res.status(200).json({
              recent: props,
            });
          });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
exports.getPreviousProperties = async (req, res, next) => {
  try {
    let count = 0;
    User.findById(req.userId).then((vendor) => {
      if (!vendor.owner) {
        Ads.find({
          $or: [
            {
              estate: req.userId,
            },
            {
              owner: req.userId,
            },
          ],
        })
          .populate("owner estate city")
          .then((props) => {
            res.status(200).json({
              recentLength: props.length,
              recent: props,
            });
          });
      } else {
        Ads.find({
          owner: req.userId,
          expired: true,
        })
          .populate("owner estate city")
          .then((props) => {
            res.status(200).json({
              recentLength: props.length,
              recent: props,
            });
          });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
exports.assignProperty = async (req, res) => {
  try {
    const { userId, selectedId } = req.body;
    selectedId.map((id) => {
      Ads.findById(id).then((ads) => {
        ads.owner = userId;
        ads.save();
      });
    });
    res.status(200).json({
      message: `Property Assigned!`,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getUserAds = (req, res, next) => {
  try {
    User.findById(req.userId).then((user) => {
      Ads.find({ user: req.userId, expired: false, rejected: false })
        .populate("user")
        .then((currentAd) => {
          Ads.find({ user: req.userId, expired: true, rejected: false })
            .populate("user")
            .then((previousAd) => {
              Ads.find({ user: req.userId, expired: true, rejected: false })
                .populate("user")
                .then((rejectedAd) => {
                  res.status(200).json({
                    user,
                    current: currentAd,
                    previous: previousAd,
                    rejected: rejectedAd,
                  });
                });
            });
        });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.republishAd = (req, res, next) => {
  try {
    Ads.findById(req.params.id).then(async (ad) => {
      ad.expired = false;
      await ad.save();
      res.status(200).json({
        message: "Advertisment Republished",
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.deleteAd = (req, res, next) => {
  try {
    Ads.findByIdAndDelete(req.params.id).then((ad) => {
      res.status(200).json({
        message: "Advertisement Deleted",
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.updateAd = (req, res, next) => {
  try {
    const newDescription = req.body.newDescription;
    const newTitle = req.body.newTitle;
    Ads.findByIdAndUpdate(
      req.body.id,
      { newDescription, newTitle, edited: true },
      { new: true }
    ).then((ad) => {
      res.status(200).json({
        message:
          "Advertisement Updated! \n Your ad will be updated after admin approval.",
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.getPendingAds = (req, res, next) => {
  console.log("hi");
  try {
    Ads.find({ approved: false })
      .populate("user")
      .then((ad) => {
        res.status(200).json({
          pending: ad,
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.updatePendingStatus = (req, res, next) => {
  console.log("hi");
  try {
    const id = req.body.id;
    const type = req.body.type;

    if (type === "approve") {
      Ads.findByIdAndUpdate(id, { approved: true }, { new: true }).then(
        (ad) => {
          return res.status(200).json({
            message: "Ad Approved!",
          });
        }
      );
    } else {
      Ads.findByIdAndUpdate(
        id,
        { approved: true, rejected: true },
        { new: true }
      ).then((ad) => {
        return res.status(200).json({
          message: "Ad Declined!",
        });
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.repostProperty = async (req, res, next) => {
  try {
    const { properties } = req.body;
    console.log("properties", properties);
    await properties.map((id) => {
      Ads.findById(id).then((ad) => {
        ad.expired = false;
        ad.save();
      });
    });
    res.status(200).json({
      message: "Ad Re-posted Successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.getEditedAds = (req, res, next) => {
  console.log("hi");
  try {
    Ads.find({ edited: true })
      .populate("user")
      .then((ad) => {
        res.status(200).json({
          edited: ad,
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.updateEditStatus = (req, res, next) => {
  console.log("hi");
  try {
    const id = req.body.id;
    const type = req.body.type;

    if (type === "approve") {
      Ads.findById(id).then((ad) => {
        ad.description = ad.newDescription;
        ad.title = ad.newTitle;
        ad.edited = false;

        ad.save();

        return res.status(200).json({
          message: "Ad Approved!",
        });
      });
    } else {
      Ads.findByIdAndUpdate(
        id,
        { approved: true, edited: false },
        { new: true }
      ).then((ad) => {
        return res.status(200).json({
          message: "Ad Declined!",
        });
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
