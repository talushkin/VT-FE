import React, { useEffect, useState, useRef } from "react";
import "./grouppaymentmodel.scss";
import Icon from "react-web-vector-icons";
import { userRequest } from "../../../api/requestMethods";
import ClientsListSelectable from "../../../components/ClientsListSelectable";
import axios from "axios";
import constants from "../../../Util/constants";
import { toast } from "react-toastify";

const GroupPayments = (props) => {
    const { onClose, totalAmount, renderedCurrency, selectedCurrency, totalAmountinUSD, managegrouppaymentdetails, reservationdata } = props;
    const blankPaymentData = {
        client_id: "",
        client_name: "",
        client_email: "",
        client_phone: "",
        client_share_amount: ""
    };
    const agentData = useState(JSON.parse(localStorage.getItem('agent')));
    const agent = agentData[0]?agentData[0]:agentData;
    const [grouppaymentdata, setGroupPaymentData] = useState([{...blankPaymentData}]);
    const [clients, setClients] = useState([]);
    const [sharedTotal, setSharedTotal] = useState(0);
    const inputRefs = useRef([]);

    const updatePaymentData = (value, index, key) => {
        let newdata = [...grouppaymentdata];
        let newSharedTotal = 0
       
        newdata[index] = {
            ...newdata[index],
            [key]: value
        };

        newSharedTotal = newdata.reduce((total, obj) => {
            let val = !isNaN(parseFloat(obj.client_share_amount)) ? parseFloat(obj.client_share_amount) : 0
            return parseFloat(total) + parseFloat(val)
        }, 0);
        if(totalAmountinUSD < newSharedTotal) {
            
            newdata[index] = {
                ...newdata[index],
                [key]: ''
            };
            newSharedTotal = newdata.reduce((total, obj) => {
                let val = !isNaN(parseFloat(obj.client_share_amount)) ? parseFloat(obj.client_share_amount) : 0
                return parseFloat(total) + parseFloat(val)
            }, 0);
        }
        setGroupPaymentData(newdata);
        setSharedTotal(newSharedTotal)

    }

    const updatePaymentDataObj = (dataObj, index) => {
        let newdata = [...grouppaymentdata];
        newdata[index] = {
            ...newdata[index],
            ...dataObj
        }
        setGroupPaymentData(newdata);
    }

    const addNewRow = () => {
        setGroupPaymentData([{...blankPaymentData}, ...grouppaymentdata]);
    }

    const removeRow = (index) => {
        const newdata = grouppaymentdata.filter((_, i) => i !== index);

        if (newdata.length === 0 || newdata[0].client_name.trim() !== "") {
            newdata.unshift({...blankPaymentData});
        }
        setGroupPaymentData(newdata);
    }

    useEffect(() => {
        getAllClients();
    }, [])

    const getAllClients = async (agentID) => {
        const clientResponse = await userRequest.get(`/client/get-clients?agent_id=${agent?.agent_id}`, {
          params: { limit: "300", skip: "0" },
        });   
        setClients(clientResponse.data.clients);
    };

    const handleGroupPayments = async () => {
        
        const dataToSubmit = grouppaymentdata.filter(item => 
            item.client_name.trim() !== "" || 
            item.client_email.trim() !== "" ||
            item.client_phone.trim() !== "" ||
            item.client_share_amount.trim() !== ""
        );

        const clientgroup = dataToSubmit.map((data, i) => {
            return ({
                item_id: data.client_id !== "" ? data.client_id : i+1,
                price: `${parseInt(data.client_share_amount)*100}`,
                name: data.client_name,
                user_email: data.client_email
            })
        })

        const booked_date = new Date(reservationdata.bookedAt)
        const bookedAt = booked_date.toISOString()

        
        const leewayPayload = {
            items: clientgroup,
            payment_provider_payload: {
                language_code: "en",
                amount: `${totalAmountinUSD}`, 
                currency_code: 'USD'//selectedCurrency
            },
            product: {
                name: reservationdata.propertyName,
                img_url: reservationdata.listing.picture.thumbnail,
                date: bookedAt,
                location: reservationdata.destination
            },
            group_complete_callback_url: `https://backend.villatracker.com/reservation/leeway-complete-group-callback`,
            group_payment_time: 24,
            leader_payment_time: 10,
            merchant_order_id: reservationdata.bookingId,
            private_field1: reservationdata.bookingId,
            private_field2: reservationdata.confirmationCode,
            group_active_callback_url: `https://backend.villatracker.com/reservation/leeway-active-group-callback`,
            success_url: `https://backend.villatracker.com/reservation/leeway-success-callback`,
            group_mode: "Survival",
            white_label: {
                "theme_color": "#512EAC",
                "btn_font_color": "#FFFFFF",
                "btn_bg_color": "#512EAC",
                "bg_color": "#F5F7F8",
                "bg_font_color": "#000000",
                "show_timer": false
            }
        }

        // console.log(clientgroup, bookedAt, leewayPayload)
        // const data = {
        //     sharedData: dataToSubmit,
        //     group_id: "lZXdheS1idXktdG9nZXRoZXJyOAsSDU1lcmNoYW50TW9kZWwYgICA-NuimAoMCxIRR3JvdXBQYXltZW50TW9kZWwYgICAmNOdlwoMogESc21pbGluZ2hvdXNlLWMxZTF3",
        //     idempotent: "6480-4601-9900-613fbb0bcbb2:smilinghouse-c1e1w",
        //     link: "https://sandbox.theleeway.com/index.html/agent/agent-payment-group/ahtzYW5kYm94LWxlZXdheS1idXktdG9nZXRoZXJyOAsSDU1lcmNoYW50TW9kZWwYgICA-NuimAoMCxIRR3JvdXBQYXltZW50TW9kZWwYgICAmNOdlwoMogESc21pbGluZ2hvdXNlLWMxZTF3/group-details?lang=en",
        //     user_id: "dheS1idXktdG9nZXRoZXJyFgsSCVVzZXJNb2RlbBiAgICEz8-XCgyiARJzbWlsaW5naG91c2UtYzFlMXc",
        // }
        // managegrouppaymentdetails(data)
        // toast.success("Group payment setup successfully", {
        //     position: "top-right",
        //     toastClassName: "custom-toast",
        // });
        // onClose()

        const config = { 
            headers: {
                'Accept' : 'application/json',
                'X-Leeway-Api-Key' : 'ee8M-TC2u-Xyub-LmYS-sRJj-8BzE-pFSA-vyge:smilinghouse-c1e1w',
                'Content-Type' : 'application/json'
            },
        };

        

        const response = await axios.post(`https://sandbox.theleeway.com/antic/api/create-ppi-agent-page-link`, leewayPayload, config);
        console.log(response);
        if(response && response.status === 200) {
            const data = {
                sharedData: dataToSubmit,
                group_id: response?.data?.group_id,
                idempotent: response?.data?.idempotent,
                link: response?.data?.link,
                user_id: response?.data?.user_id,
            }
            managegrouppaymentdetails(data)
            toast.success("Group payment setup successfully", {
                position: "top-right",
                toastClassName: "custom-toast",
            });
            onClose()
        }
        
    }

    

    console.log('group payment data', grouppaymentdata, clients);

    return (
        <>
            <div
                className="modal gap-2"
                id="staticBackdrop"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-labelledby="staticBackdropLabel"
                style={{overflow: 'unset', textAlign: 'center'}}
            >
                <div className="modal-dialog modal-xl modal-dialog-centered" style={{display: 'block'}}>
                    <div className="modal-content ">
                        <div className="modal-header" style={{display: 'block'}} >
                            <div className="row">
                                <div className="col-12">
                                    <h1 className="text-center" style={{marginTop: '15px', fontSize: '25px'}}>
                                        <b style={{ color: 'black' }}>{`Group Payment List`}</b>
                                    </h1>
                                    <h3 className="text-center" style={{ fontSize: 'revert' }}>
                                        Provide list of clients with their details and share to setup a group payment channel
                                    </h3>
                                </div>
                            </div>
                          
                            <button
                                type="button"
                                className="btn-close "
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {onClose()}}
                                style={{position: 'absolute', right: '10px', top: '10px'}}
                            ></button>
                        </div>
                        <hr style={{margin:"1rem 0 0 0"}} />

                        <div className="modal-body my-3 mx-3 offer-container" style={{position: 'relative'}}>
                    
                            <div className="row header-row">
                                <div className="col-3 header-row-text gppmnt-text-left gp-pmnt-hd-pad-10">
                                    Client Name
                                </div>
                                <div className="col-3 header-row-text gppmnt-text-left gp-pmnt-hd-pad-10">
                                    Email
                                </div>
                                <div className="col-2 header-row-text gppmnt-text-left gp-pmnt-hd-pad-10">
                                    Phone
                                </div>
                                <div className="col-2 header-row-text gppmnt-text-left gp-pmnt-hd-pad-10">
                                    Amount (USD)
                                </div>
                                <div className="col-2 header-row-text gppmnt-text-left gp-pmnt-hd-pad-10">
                                    
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    {grouppaymentdata.map((item, i) => (
                                        <div className="row data-row" key={i} style={{position: 'relative', marginTop: '10px'}} >
                                            
                                            <ClientsListSelectable 
                                                item={item}
                                                onChange={(value) => updatePaymentData(value, i, 'client_name')}
                                                clients={clients}
                                                inputref={el => inputRefs.current[i] = el}
                                                updateClientData={(dataobj) => updatePaymentDataObj(dataobj, i)}
                                            />
                                            <div className="col-3 gp-pmnt-pad-10">
                                                <input 
                                                    type="text" 
                                                    value={item.client_email}
                                                    onChange={(e) => updatePaymentData(e.target.value, i, 'client_email')}
                                                    className="form-control"
                                                    placeholder="Enter email"
                                                />
                                            </div>
                                            <div className="col-2 gp-pmnt-pad-10">
                                                <input 
                                                    type="text" 
                                                    value={item.client_phone}
                                                    onChange={(e) => updatePaymentData(e.target.value, i, 'client_phone')}
                                                    className="form-control"
                                                    placeholder="Enter phone"
                                                />
                                            </div>
                                            <div className="col-2 gp-pmnt-pad-10">
                                                <input 
                                                    type="text" 
                                                    value={item.client_share_amount}
                                                    onChange={(e) => {
                                                        if(!isNaN(e.target.value)){
                                                            updatePaymentData(e.target.value, i, 'client_share_amount')
                                                        }
                                                    }}
                                                    className="form-control"
                                                    placeholder="Enter amount"
                                                />
                                            </div>
                                            <div className="col-2 gp-pmnt-pad-10">
                                                <span onClick={() => i === 0 ? addNewRow() : removeRow(i)}>
                                                    <Icon
                                                        name={i === 0 ? 'pluscircle' : 'closecircle'}
                                                        font="AntDesign"
                                                        color={i === 0 ? "#28a745" : "#dc3545"}
                                                        size={20}
                                                        style={{ cursor: "pointer" }}
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    
                                </div>
                                
                            </div>
                            
                            
                        </div>
                        <div className="modal-footer" style={{display: 'block'}}>
                            <div className="row">
                                <div className="col-9" style={{textAlign: 'left'}}>
                                    <p style={{fontSize: '26px', fontWeight: 'bold'}}>
                                        <span style={{padding: '10px 10px 10px 10px'}}>Total Shared - $ {sharedTotal} / $ {totalAmountinUSD}</span>
                                        {/* <span style={{
                                            fontSize: '16px', 
                                            padding: '10px 10px 10px 10px', 
                                            border: '2px solid blue', 
                                            borderRadius: '10px', 
                                            marginLeft: '20px',
                                            color: 'blue',
                                            cursor: 'pointer'
                                        }}>Share Equally</span> */}
                                    </p>
                                
                                </div>
                                <div className="col-3" style={{textAlign: 'right'}}>
                                    <button 
                                        className="btn btn-primary"
                                        disabled={sharedTotal !== totalAmountinUSD}
                                        onClick={() => { handleGroupPayments() }}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    );
}

export default GroupPayments;