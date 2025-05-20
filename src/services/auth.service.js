import axios from 'axios';
import TokenService from './token.service';
import { baseURL } from '../core';
import { useEffect } from 'react';
import constants from '../Util/constants';

const userToken = localStorage.getItem('jToken');

const register = (data) => {
  return axios.post('/auth/signup', data);
};

const updateProfilePicture = (data) => {
  const headersForImage = {
    authorization: `Bearer ${userToken}`,
    'Content-Type': 'multipart/form-data',
  };

  return axios
    .post(`${baseURL}/agent/update-profile-picture`, data, {
      headers: headersForImage,
    })
    .then((response) => {
      return response.data;
    });
};

const updateTravelAgency = (data, data1) => {
  const headersForImage = {
    authorization: `Bearer ${userToken}`,
  };

  return axios
    .post(
      `${baseURL}/travel-agency/update-travel-agencies?agency_id=${data1}`,
      data,
      {
        headers: headersForImage,
      }
    )
    .then((response) => {
      return response.data;
    });
};

const updateAgentApi = (agent_id, data) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .post(`${baseURL}/agent/update-agent?agent_id=${agent_id}`, data, {
      headers: headersForupdate,
    })
    .then((response) => {
      localStorage.setItem('agent', JSON.stringify(response.data.doc) || []);
      return response.data;
    });
};

const updateProfileApi = async (
  agent_id,
  agency_id,
  data,
  AgencyPayload,
  updateProfilePassword
) => {
  if (agent_id) {
    await updateAgentApi(agent_id, data);
  }

  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };

  // Update agency
  const response = await axios.post(
    `${baseURL}/travel-agency/update-travel-agencies?agency_id=${agency_id}`,
    AgencyPayload,
    {
      headers: headersForupdate,
    }
  );

  // Save updated agency data
  localStorage.setItem('travelAgency', JSON.stringify(response?.data?.data));

  // Check and update password
  if (
    ((updateProfilePassword?.newPass !== '' ||
      updateProfilePassword?.newPass !== undefined) &&
      updateProfilePassword?.ConfirmPass !== '') ||
    updateProfilePassword?.ConfirmPass !== undefined
  ) {
    console.log('checking updating password ', updateProfilePassword);
    await UpdatePassword(updateProfilePassword);
  }

  return response.data;
};

const UpdatePassword = async (data) => {
  console.log('Updating password');
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };

  const updatePasswordResponse = await axios.post(
    `${baseURL}/agent/update-password`,
    data,
    {
      headers: headersForupdate,
    }
  );

  return updatePasswordResponse.data;
};

const AddNewClientApi = (data) => {
  const agentId = localStorage.getItem('agent_id');
  console.log('agentId ', agentId);
  console.log('data is ', data);
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .post(`${baseURL}/client/create-client`, data, {
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const UpdateClientApi = (client_id, data) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .post(`${baseURL}/client/update-client?client_id=${client_id}`, data, {
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const VerifyCodeApi = (data) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .post(`${baseURL}/agent/verify-code`, data, {
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const ChnagePasswordApi = (data) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .post(`${baseURL}/agent/change-password`, data, {
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const AdminReset = (data) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .post(`${baseURL}/agent/admin-reset-password`, data, {
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const GetAgency = (data) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .get(`${baseURL}/travel-agency/get-travel-agencies?agency_id=${data}`, {
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const GetProfile = (data) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .get(`${baseURL}/agent/get-profile?agent_id=${data}`, {
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const ForgotPasswordApi = (data) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .post(`${baseURL}/agent/forget-password`, data, {
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const GetReservation = (data) => {
  console.log(userToken, 'userToken');
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .get(`${baseURL}/reservation/get-reservations`, {
      params: data,
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const updateReservation = (data, reservationID) => {
  console.log(userToken, 'userToken');
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .post(`${baseURL}/reservation/update-reservations?id=${reservationID}`, {
      params: data,
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const updateReservationStatus = async (reservationID, status) => {
  try {
    const response = await axios.put(
      `${baseURL}/reservation/update-reservation`,
      { status }, 
      {
        params: { id: reservationID }, 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
      }
    );
    console.log('Reservation status updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating reservation status:', error);
    throw error;
  }
};


const GetClientCstApi = (name, email, agentId) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  // ${baseURL}
  return axios
    .get(
      `${baseURL}/client/get-clients?limit=20&agent_id=${agentId}&search=${name}&email=${email}
    `,
      {
        headers: headersForupdate,
      }
    )
    .then((response) => {
      return response.data;
    });
};

const GetSingleClientApi = (agentId, agencyId, clientId) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .get(
      `${baseURL}/client/get-client?agent_id=${agentId}&agency_id=${agencyId}&client_id=${clientId}
    `,
      {
        headers: headersForupdate,
      }
    )
    .then((response) => {
      return response.data;
    });
};

const GetWishListLog = (agent_id, agency_id, agent_role, sortby, limit, skip) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  //${baseURL}
  return axios
    .get(`${baseURL}/wishlist/get-wishlists?agent_id=${agent_id}&agency_id=${agency_id}&agent_role=${agent_role}&sortBy=${sortby}&limit=${limit}&skip=${skip}`, {
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const AgentSignup = (data) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .post(`${baseURL}/agent/signup`, data, {
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const DestinationsOptions = () => {
  console.log('loading Destinations from SHUB...');
  const headersForupdate = {
    authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImlzc3VlZCI6IjE2NzUxMTI3NDYxMzYiLCJleHAiOjE2NzUxMTI4MDYsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6ImVmNzY1MDIyLTZhNzctNGZkMy04Njg1LTFhZTFhZmEzOTJhZSIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.N9MIeiLyrT3hBUtMJsTvwbYW5Z_o7ZSBuZmir2ytrb8DiE4MoXcmh8C6KriWhmnRqUnSMBRtuLcauVbqjFTorOcWMOd2RQGmisPgXBm1tHT30Hl0i57rQuLZHAVW201ot-TdQwW9oEZ3n2HTGu_A6tRhTizVmG6NRAd5KhOB2_c`,
  };
  return axios
    .get(constants.SHUB_URL+`/local/destinations`, {
      headers: headersForupdate,
    })
    .then((response) => {
   // console.log('response:',response.data.data[0])
      const regions = response?.data.data[0]?.allRegions
      const countries = response?.data.data[0]?.allCountries
      const cities = response?.data.data[0]?.allCities
       console.log("regions:",regions)
      console.log("countries:",countries)
      console.log("cities:",cities)
      localStorage.setItem('regions', JSON.stringify(regions));
      localStorage.setItem('countries', JSON.stringify(countries));
      localStorage.setItem('cities', JSON.stringify(cities));
      return response.data;
    });
};

const getHotDesinationsApi = () => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .get(`${baseURL}/hotdestination/get-hotdestinations`, {
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const approveAgent = (data, agent_id) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .post(`${baseURL}/agent/approve-agent?agent_id=${agent_id}`, data, {
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const travelAgencyApproval = (data, agency_id) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .post(`${baseURL}/travel-agency/approve?agency_id=${agency_id}`, data, {
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const trianglLuxuryApi = (data) => {
  const token2 =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X29iamVjdF9pZCI6Mzk5MTU4NzUsInVzZXJfaWQiOiI0MDY2NTAyMSIsInVzZXJfbmFtZSI6InN5c3RlbStsdW5hLTh5NXljIiwic2NvcGUiOlsiYnJpdm8uYXBpIl0sImF0aSI6ImI5MTliYmJiLTA1ZWItNDlmOC05MjlhLWM0MTJlYzY3NWI2YyIsImlzc3VlZCI6IjE2NzUzNzA2NDMzNzMiLCJleHAiOjIyOTczMzM3MjcsInNlcnZpY2VfdG9rZW4iOm51bGwsImF1dGhvcml0aWVzIjpbIlJPTEVfU1VQRVJfQURNSU4iLCJST0xFX0FETUlOIl0sImp0aSI6IjExODQzYjg2LWIyYzUtNGMwNS1hYWZlLTcxZTI4NGIyNjNlOCIsImNsaWVudF9pZCI6IjkzOTFlYjVkLWUwNmUtNDY4MS1iNTdhLWQwZTU3NDhhM2RlZSIsIndoaXRlX2xpc3RlZCI6ZmFsc2V9.Mqmx7onIVz_EVAunhwqBAhAmlsGXMQ18hh_EV_61KQIpaGXlrgXgx1hOOdNWLFriG3Un6jfS7H7vwMAYmBT6-8yl9L7VB7Cpxva49XozuSJazQ42UDDlTOsnWAmatzmFna-Uzjc8MDfVQbR8AwMiFq_Jb9ViaJ4XBkj2KhEKs1g';
  const headersForupdate = {
    Authorization: `Bearer ${token2}`,
  }; 
  return axios
    .get(constants.SHUB_URL+'/local/listings?'+data, {
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const sendEmailApi = (data) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .post(`${baseURL}/email/send-email`, data, {
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const hotdestinationAddLikeApi = (id) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .patch(
      `${baseURL}/hotdestination/add-one-like?id=${id}`,
      {},
      {
        headers: headersForupdate,
      }
    )
    .then((response) => {
      return response.data;
    });
};

const hotdestinationRemoveLikeApi = (id) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .delete(`${baseURL}/hotdestination/remove-one-like?id=${id}`, {
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const AddSubAgentApi = (data) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  return axios
    .post(`${baseURL}/agent/add-sub-agent`, data, {
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};


const addWishListAPi = (data) => {
  const headersForupdate = {
    authorization: `Bearer ${userToken}`,
  };
  
  return axios
    .post(`${baseURL}/wishlist/add-wishlist`, data, {
      headers: headersForupdate,
    })
    .then((response) => {
      return response.data;
    });
};

const AuthService = {
  hotdestinationAddLikeApi,
  hotdestinationRemoveLikeApi,
  sendEmailApi,
  GetWishListLog,
  AgentSignup,
  GetReservation,
  updateReservation,
  updateReservationStatus,
  register,
  updateProfilePicture,
  updateProfileApi,
  AddNewClientApi,
  GetProfile,
  DestinationsOptions,
  updateTravelAgency,
  GetClientCstApi,
  GetSingleClientApi,
  getHotDesinationsApi,
  approveAgent,
  UpdateClientApi,
  VerifyCodeApi,
  ChnagePasswordApi,
  ForgotPasswordApi,
  travelAgencyApproval,
  trianglLuxuryApi,
  AddSubAgentApi,
  addWishListAPi,
  AdminReset
};

export default AuthService;
