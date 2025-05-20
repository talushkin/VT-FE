import React, { useEffect, useState } from "react";
import './termsConditions.scss';
import pageBg from "../../assets/sweem.jpg";
import { useSelector } from "react-redux";
import PageHeader from "../../components/PageHeader";

const TermsConditions = (props) => {
    const { agency, agent } = props;
    const user = useSelector((state) => state.user.user);

    return (
        <div className="card">
            <div className="reservations-container">
                <div
                style={{
                    backgroundImage: `url(${pageBg})`,
                    "background-size": "cover",
                }}
                >
                <PageHeader
                    agent={agent}
                    agency={agency}
                    searchOpen={null}
                    style={{ position: "absolute", marginTop: "70px" }}
                />
                </div>
            </div>
            <div className="row" style={{margin: 'auto', width: '80%'}}>
                <div className="col-12 text-center" style={{padding: '15px 0px 15px 0px', margin: '30px 0 30px 0'}}>
                    <span style={{fontSize: '50px', fontWeight: 'bold'}}>Booking Terms and Conditions - Villa Tracker</span>
                </div>
                <div className="row" style={{margin: 'auto'}}>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '23px'}}>Villa Tracker ("Villa Tracker", "we" or "us") welcomes you ("you" or "user") to Villa Tracker's website (the "Site").</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '23px'}}>Villa Tracker offers an online platform facilitating short termrental of exclusive private furnished residential homes worldwide (each a "Property") from each Property's respective owner,property manager and/or a holiday rental company (each, for the purposes hereof, an "Owner"). Villa Tracker (either alone or through third party service providers) will deliver corresponding services relating to the Property throughout the term of your stay in the Property.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '23px'}}>Each booking of the Property will be subject to confirmation by the respective Owner and will be entered into between you and the Owner, however payment for bookings will be made by you to Villa Tracker, in Villa Tracker's capacity as an agent of the Owner.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '23px'}}>These Booking Terms and Conditions together with the booking contract to be signed for each booking (the "Booking Form" and collectively the "Terms"), contain all the terms of your booking of the Property.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '23px'}}>The Terms apply to you and to all guests on your behalf staying in the Property ("Guests").</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Booking Process</p>
                        <p style={{fontSize: '23px'}}>Each booking of a Property will be valid only upon Villa Tracker's receipt of:</p>
                        <ul style={{fontSize: '23px', color: '#707070;'}}>
                            <li>
                                A duly completed and signed Booking Form. The signatory of the Booking Form must be over 18 years of age.
                            </li>
                            <li>
                                If the booking is made 60 days or more prior to date of arrival at Property, the payment of a deposit of 50%of the total booking price, or
                            </li>
                            <li>
                                If the booking is made less than 60 days prior to date of arrival, payment of 100% of the total booking price.
                            </li>
                        </ul>
                        <p style={{fontSize: '23px'}}>Your receipt of a provisional Booking Form constitutes our provisional offer to you to book the Property. If we do not receive the duly completed and signed booking form within 24 hours, and payment of the required deposit within three working days of your receipt of the Booking Form, our provisional offer will expire. In such circumstances, we will be free to offer the Property to any third party.</p>
                        <p style={{fontSize: '23px'}}>Receipt by Villa Tracker of the complete Booking Form and required payment of the deposit confirms your booking.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Security Deposit and Services Deposit</p>
                        <p style={{fontSize: '23px'}}>Villa Tracker requires the deposit of a security deposit with respect to all bookings against any breakage or damage to the Property or any adjacent property caused during the rental period. The required security deposit varies from Property to Property.</p>
                        <p style={{fontSize: '23px'}}>If your booking excludes the cost of food, drink, and other services, the costs of which Villa Tracker will incur on your behalf, then a service deposit will also be applied in addition to the security deposit. The required service deposit for each Property will be disclosed upon booking.</p>
                        {/* <p style={{fontSize: '23px'}}>Villa Tracker and/or the Owner reserves the right to use the security deposit and the services deposit to pay for any unpaid invoices on your behalf upon departure from the Property.</p> */}
                        <p style={{fontSize: '23px'}}>The security deposit and service deposit (if required) is due two weeks prior to arrival and will be refundable at the latest one month after your departure of the Property, less any costs incurred by Villa Tracker during and/or in connection with your stay in the Property or cost of damages. </p>
                        <p style={{fontSize: '23px'}}>Repayment of these security deposit and service deposits may be delayed if the costs of any repair have to be determined.</p>
                        <p style={{fontSize: '23px'}}>The security and services deposit shall be taken as a credit card authorization or bank transfer. Should you wish to pay the security and services deposit by bank transfer rather than by credit card authorization, Villa Tracker will not be held responsible for any fluctuation in exchange rate, and the amount returned will be returned in the currency according to where the booking takes place.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Balance Payment</p>
                        <p style={{fontSize: '23px'}}>Full payment of the balance of your payment (if applicable) is due 60 days prior to the date of your arrival to the Property. If the payment is not received by such time, we reserve the right to cancel your booking and levy cancellation charges as detailed below. </p>
                        <p style={{fontSize: '23px'}}>Should the balance of your payment be received after 60 days prior to the date of your arrival to the Property, the amount due shall be subject to an interest of 7% p.a.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Payment Methods</p>
                        <p style={{fontSize: '23px'}}>Deposit and balance payments can be made by: (a) bank transfer, (b) Credit card, (c) Debit Card. Details will be included in the Booking Form.</p>
                        <p style={{fontSize: '23px'}}>For all bookings, the booking price is fixed in the currency of the country where the booking is taking place. For example, for all booking in Switzerland the booking price is set in Swiss Francs, and for bookings in Austria and France the booking price is set in Euros.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Changes and Cancellations by you</p>
                        <p style={{fontSize: '23px'}}>If you wish to make any changes to your confirmed booking, you must notify Villa Tracker in writing as soon as possible. Villa Tracker shall make every reasonable effort to meet your request, but cannot guarantee that it will meet such request. </p>
                        {/* <p style={{fontSize: '23px'}}>Any modification to your Booking Form are only valid if they are made in writing, and if they are signed by you and us.</p> */}
                        <p style={{fontSize: '23px'}}>Should you wish to cancel your booking for whatever reason, this should also be made in writing and charges will be levied as follows:</p>
                        <ul style={{fontSize: '23px', color: '#707070;'}}>
                            <li>
                                If cancelled more than 60 days before the arrival date, the deposit payment will be forfeited;
                            </li>
                            <li>
                                If cancelled less than 60 days before the arrival date, the full booking price will be forfeited and 100% of the booking shall bedue and payable to Villa Tracker.
                            </li>
                        </ul>
                        <p style={{fontSize: '23px'}}>We strongly advise that you purchase suitable holiday insurance for the duration of your stayin a Property, including cancellation insurance to limit your cancellation risk.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Changes and Cancellation by us</p>
                        <p style={{fontSize: '23px'}}>In the unlikely event that any alteration is made by Villa Tracker which is of a reasonably material nature (for example, a change of booking date), you have the right to cancel your booking and receive a full refund of monies actually paid.</p>
                        <p style={{fontSize: '23px'}}>Notwithstanding the foregoing, Villa Tracker shall not be liable to refund you any money should we be forced to cancel or change your booking due to circumstances constituting Force Majeure. Such circumstances shall include, but are not limited to, war or threat of war, riot, civil strife, terrorism, industrial disruption, natural disasters, fire, technical problems, adverse weather, governmental action, government travel restrictions due to health reasons and similar events beyond our control.</p>
                        <p style={{fontSize: '23px'}}>In the exceptional circumstance that the Property booked is sold and no longer available for rent, you will notified as soon as possible and all monies paid by you will be refunded. In such circumstances Villa Tracker shall use all reasonable endeavors to assist you in finding another Property to substitute your cancelled booking.</p>
                        <p style={{fontSize: '23px'}}>Villa Trackershall have the right to cancel your booking, with no refund or compensation if:</p>
                        <ul style={{fontSize: '23px', color: '#707070;'}}>
                            <li>
                                You do not comply with the payment schedule.
                            </li>
                            <li>
                                You or your Guests fail to comply with any of the Terms.
                            </li>
                            <li>
                                The group size exceeds the agreed number of guests in the Property as stated in the Booking Form.
                            </li>
                            <li>
                                Should you provide misleading or false information, for example with respect to the identity of the Guests. 
                            </li>
                        </ul>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Check-in and Check-out Times</p>
                        <p style={{fontSize: '23px'}}>The check-in time to the Property on the day of arrival is at 16:00 pm and the check-out time on the day of departure is at 10:00 am. </p>
                        <p style={{fontSize: '23px'}}>Unless otherwise agreed, if you do not comply with the check-out time, we reserve the right to withhold your security deposit and charge an amount equal to one day of extra rental pro-rata.</p>
                        
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Liability for Damages to the Property</p>
                        <p style={{fontSize: '23px'}}>You will be fully liable for any breakages, damage, or reduction in value to the Property and/or to adjacent properties caused during your stay in the Property by you or by any of your Guests. Any such costs of damage will be deducted from your security and/or services deposit. If the cost of damages exceed the sum of your deposit/s, you will be required to pay Villa Tracker the sum of such additional costs of damage. We recommend that you ensure that your insurance policy covers accidental damage to the Property and its contents.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Pricing</p>
                        <p style={{fontSize: '23px'}}>All prices published on the site are for guidance purposes only. We reserve the right to alter or correct errors in any quoted or published prices at any time prior to the booking being confirmed.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Property and Service Description</p>
                        <p style={{fontSize: '23px'}}>Villa Tracker uses its best efforts to ensure that all information on the Site relating to the Property description, the services offered and prices are accurate. In some circumstances, changes and errors occur and Villa Tracker reserves the right to correct prices or inaccuracies in such circumstances.</p>
                        <p style={{fontSize: '23px'}}>The Properties are not hotels and, as such, are not generally classified by the tourist authorities or international rating agencies. All luxury properties may not contain the same facilities or standards if judged by objective criteria.</p>
                        <p style={{fontSize: '23px'}}>The Property is provided on an "as-is" basis and Villa Tracker and its affiliates, and their respective officers, directors, shareholders, employees, sub-contractors, agents and licensors (collectively, "Villa Tracker's Representatives") disclaim all warranties of any kind or nature, express or implied, in connection with the Property.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Special Requests</p>
                        <p style={{fontSize: '23px'}}>If you have any special request for complimentary services, you must inform Villa Tracker at the time of booking and clearly note it on your Booking Form. Villa Tracker shall use all reasonable efforts to accommodate such requests, however Villa Tracker cannot guarantee its compliance with all special requests and Villa Tracker shall not be liable for failure to comply with special requests.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Use of Property</p>
                        <p style={{fontSize: '23px'}}>You shall use the Property solely for the purpose for which it has been rented to you (personal lodging). You shall not use the Property for any commercial use (including without limitation, to hold seminars, large parties etc.) unless expressly agreed to in writing by Villa Tracker. You shall not take and/or use photographs of the Property for any commercial purpose. You shall not sublet the property in any circumstance whatsoever.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Rules and Safety Precautions</p>
                        <p style={{fontSize: '23px'}}>Safety: The Properties are private homes and not hotels. There are no legal notices for precaution such as those found in hotels. </p>
                        <p style={{fontSize: '23px'}}>The Property may contain a notice covering rules and security precautions concerning the use of the Property or its facilities. Please read these rules and security precautions carefully if they are provided as they are an integral part of the Terms. </p>
                        <p style={{fontSize: '23px'}}>Neither Villa Tracker nor the respective Owner shall be liable to you and/or to any Guests for any accidents or bodily injuries caused to you and/or to any Guests while staying at the Property.</p>
                        <p style={{fontSize: '23px'}}>Children: We will endeavor to inform you of the suitability of the Property for children. However, please note that the Property may not have the same levels of safety measures that you may have in your home and the supervision of children is your sole responsibility. Neither Villa Tracker nor any Owner shall be held responsible for any children left unattended within a Property.</p>
                        <p style={{fontSize: '23px'}}>Wellness Area and Swimming Pool:Use of the wellness area and swimming pool is at yours and your Guests’ own risk. You and your Guests are to comply with any rules and security precautions pertaining to the wellness area and pool as made available in the Property as well as with any instructions given by us or by the Owner. </p>
                        <p style={{fontSize: '23px'}}>Without prejudice to the generality of the foregoing, the following are strictly prohibited in the wellness and pool area:</p>
                        <ul style={{fontSize: '23px', color: '#707070;'}}>
                            <li>
                                Running.
                            </li>
                            <li>
                                Diving or jumping into the swimming pool or hot tub.
                            </li>
                            <li>
                                Drinking of any alcohol or using the wellness area when under the influence of alcohol or drugs, and
                            </li>
                            <li>
                                Leaving children unsupervised in the wellness area.
                            </li>
                        </ul>
                        <p style={{fontSize: '23px'}}>Children: The direct, visual, and active supervision of children present in the wellness area by an adult is essential and under your sole responsibility. The swimming pool, hot tub etc. located in the Property do not comprise an alarm system, safety nets, or other safety measures designed to prevent the risk of drowning. To ensure the safety of children, the following precautions must be taken, in particular:</p>
                        <ul style={{fontSize: '23px', color: '#707070;'}}>
                            <li>
                                Never leave young children alone near the swimming pool or hot tub.
                            </li>
                            <li>
                                Never leave a child alone in the water, even if they know how to swim, or in a hammam, steam room, sauna etc. They must always be under the supervision of an adult capable of saving them in the event of an accident.
                            </li>
                            <li>
                                Never leave toys or other items floating on the water, they may encourage children to approach the water, and
                            </li>
                            <li>
                                Always fit inflatable armbands or floating costumes on young children.
                            </li>
                        </ul>
                        <p style={{fontSize: '23px'}}>The swimming pools in the Properties may be shallower than 1.4m and there are no lifeguards on duty at any of the Properties and as a private facility, the safety equipment may be of poorer quality than you are used to. </p>
                        <p style={{fontSize: '23px'}}>Sometimes cleaning of the swimming pools and hot tubs will be necessary. We will try do this at appropriate times in order to minimize disruption, but in some cases this may be unavoidable.</p>
                        <p style={{fontSize: '23px'}}>If you fail to comply with the rules set out above and/or made available in the Property, Villa Trackers' staff shall be entitled to prohibit yours and/or your Guests' use of the wellness area and pool for the duration of your stay.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Security</p>
                        <p style={{fontSize: '23px'}}>You and your guests must use the Property and the furnishing there in as they should normally be used.</p>
                        <p style={{fontSize: '23px'}}>You and your guests must use the Property conscientiously and avoid any carelessness or negligence. In particular, you must not leave the Property unlocked without supervision to avoid any intrusion. </p>
                        <p style={{fontSize: '23px'}}>Please note that not all Properties contain safety deposit boxes. If required please inform Villa Tracker at the time of booking so that we can provide a safety deposit box in time. There is a charge for this service.</p>
                        <p style={{fontSize: '23px'}}>If there is an alarm in the Property, please ensure that it is switched on whenever you leave the Property and at night before going to sleep. Please note that the failure to do so could determine whether or not the property’s insurance will cover any losses in case of a burglary.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Animals</p>
                        <p style={{fontSize: '23px'}}>No animals are allowed into the Property without our prior written consent. An increased damage deposit and a one-off cleaning charge will be required as part of this consent. Please note that in a number of Properties, animals are prohibited altogether. If during your stay, damage is caused to the Property by your animal, we reserve the right to ban the animal from the Property. If you are found to have an animal in the Property without our prior written consent, Villa Tracker's staff will have the right to evict you and all your Guests from the Property without refund.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Smoking</p>
                        <p style={{fontSize: '23px'}}>Smoking is strictly prohibited in all Properties. Both Villa Tracker and each respective Owner reserve the right to remove from the Property any person breaching this condition without refund. In the event that smoking has been found to occur within a Property, an additional cleaning charge of CHF 2.000 will be payable Villa Tracker immediately.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Property capacity and No. of Guests</p>
                        <p style={{fontSize: '23px'}}>Each Property has a maximum capacity which is detailed on the Site and in the Booking Form. No Property can exceed the maximum capacity unless otherwise agreed to in writing by us prior to arrival.</p>
                        <p style={{fontSize: '23px'}}>Only persons confirmed on the Booking Form may occupy and use the facilities of the Property,unless otherwise agreed to in writing by us prior to arrival.</p>
                        <p style={{fontSize: '23px'}}>There are to be no additional Guests invited to eat or stay overnight at the Property without the prior written consent of Villa Tracker. In the event that such consent is given, Villa Tracker reserves the right to charge extra for the additional Guests.</p>
                        <p style={{fontSize: '23px'}}>Should the number of Guests exceed the maximum capacity of the Property,Villa Tracker reserves the right to refuse you entry to the Property or terminate your occupancy of the Property without refund.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Removal of Ashes from the Fire</p>
                        <p style={{fontSize: '23px'}}>Due to the inherent fire hazards, Guests will remove ashes from the fire place very carefully and at their own risk. If any hesitations, please contact Villa Tracker to organize the removal.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Keys</p>
                        <p style={{fontSize: '23px'}}>Upon your arrival at the Property, you will be provided with a number of keys for the Property. All keys provided need to be returned to the Villa Tracker staff at the end of your stay in the Property. If the same number of keys is not returned to Villa Tracker's staff at the end of your stay, a charge to replace these keys or to change the locks will be payable to Villa Tracker. Said sum may be deducted from your security deposit.</p>
                        <p style={{fontSize: '23px'}}>You will be solely responsible for any losses at the Property or damages to the Property due to theft if you or your Guests leave the Property unsecured.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Termination</p>
                        <p style={{fontSize: '23px'}}>If in the reasonable opinion ofVilla Tracker or the Property Owner, you or any Guest of yours behaves in a manner which is illegal, which causes or is likely to cause a danger, excessive disturbance to neighbors, damage to the Property, or acts in breach of any provision of the Terms, Villa Tracker may terminate your rental immediately and you shall be required to leavethe Property immediately. In this event, you shall not to be entitled to any refund and you shall be fully liable for any expenses incurred as a result of your or any of your Guests' conduct.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Third Party Services</p>
                        <p style={{fontSize: '23px'}}>Villa Tracker may employ the services of third party suppliers, including without limitation with respect to Chefs, butlers, housekeepers, ski instruction, airport transfers, childcare and babysitting.</p>
                        <p style={{fontSize: '23px'}}>Any services Villa Tracker arranges for you through the employment of third party service providers will be subject to such third party’s terms and conditions.</p>
                        <p style={{fontSize: '23px'}}>You will be solely liable to pay the costs of any third party service. All costs must be settled prior to the end of your stay at the Property. Villa Tracker will not be responsible for any outstanding costs due to any third party supplier and Villa Tracker reserves the right to deduct any outstanding costs to any third party suppliers from your security deposit plus the cost of any taxes and credit card fees due.</p>
                        <p style={{fontSize: '23px'}}>We do not make any representations or warranties regarding the services provided by any third party service provider.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Complaints and Problems</p>
                        <p style={{fontSize: '23px'}}>We shall use our best commercial efforts to ensure that you have a trouble-free stay at the Property. We shall use our best commercial efforts to resolve any problems as soon as reasonably possible once we have been informed of such. If you have reason to be dissatisfied with the Property or the service of a supplier, please contact us during your stay in the Property.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Limitation of Liability</p>
                        <p style={{fontSize: '23px'}}>TO THE FULLEST EXTENT PERMITTED UNDER LAW, IN NO EVENT SHALL Villa Tracker AND/OR Villa Tracker'S REPRESENTATIVES BE LIABLE TO YOU OR TO OTHERS FOR ANY DAMAGES WHATSOEVER, INCLUDING WITHOUT LIMITATION, ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, EXEMPLARY, CONSEQUENTIAL OR EXEMPLARY DAMAGES OF ANY KIND UNDER ANY LEGAL THEORY, RESULTING FROM OR ARISING OUT OF YOUR USE OR INABILITY TO USE THE PROPERTY OR FROM THE FAILURE OF Villa Tracker TO PERFORM UNDER THESE TERMS AND/OR FROM ANY OTHER ACT OR OMISSION OF Villa Tracker OR BY ANY OTHER CAUSE WHATSOEVER, REGARDLESS OF WHETHER Villa Tracker HAD BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
                        <p style={{fontSize: '23px'}}>WITHOUT LIMITING THE GENERALITY OF THE FOREGOING AND TO THE MAXIMUM EXTENT PERMITED BY LAW, Villa Tracker'S AND Villa TrackerS' REPRESENTATIVES' TOTAL AGGREGATE LIABILITY FOR ALL DAMAGES OR LOSSES WHATSOEVER ARISING HEREUNDER AND/OR IN CONNECTION WITH YOUR USE OR INABILITY TO USE THE PROPERTY, SHALL BE LIMITED TO THE AMOUNTS ACTUALLY RECEIVED BY Villa Tracker FROM YOU UNDERTHESE TERMS.</p>
                        <p style={{fontSize: '23px'}}>SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY AS SET FORTH HEREIN. IN THOSE JURISDICTIONS, THE DISALLOWED EXCLUSIONS SHOULD BE REGARDED AS DELETED AND SEVERED FROM THE TERMS.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Passport and visa Requirements</p>
                        <p style={{fontSize: '23px'}}>It is your responsibility to comply with the local laws relating to visas and authorizations for the country in which the Property is located.</p>
                        <p style={{fontSize: '23px'}}>Please contact your local office for foreign travel and passports to enquire about passport, visa, and health requirements for the country in which the Property is located.</p>
                        <p style={{fontSize: '23px'}}>It is your responsibility to ensure that you have in your possession all necessary and valid travel documents.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Breach of Terms</p>
                        <p style={{fontSize: '23px'}}>If, after the conclusion of these Terms, you do not make the required payments or you violate any other provision of the Terms, the Owner and/or Villa Tracker reserve their right to immediately terminate these Terms and refuse you access to the Property. In this event, no refund or compensation shall be due to you from either the Owner or Villa Tracker. The Owner and Villa Tracker reserve their right to any damages or loss of profit caused to them directly or indirectly from your breach of these Terms. You will indemnify and hold Villa Tracker harmless from and against all losses and/or damages arising from any act or default on your part or on the part of any Guest on your behalf. </p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Entire Agreement</p>
                        <p style={{fontSize: '23px'}}>The Terms, the list of rules and safety precautions of the Property, if applicable,and all applicable laws, constitute the entire understanding and agreement between you and the Owner for the short-term rental of the Property and between you, Villa Tracker, the Owner, and any independent service providers for the services. </p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Applicable Law and Dispute Resolution</p>
                        <p style={{fontSize: '23px'}}>These Terms and Conditions are to be construed, and any dispute between the parties determined, under the laws of Switzerland.</p>
                        <p style={{fontSize: '23px'}}>All disputes arising out of or in connection with these Terms shall be submitted to mediation in accordance with the Mediation Rules of the Swiss Chamber of Commercial Mediation.</p>
                        <p style={{fontSize: '23px'}}>If no settlement can be reached by mediation, the dispute shall be finally settled by the courts of the place where the Property is situated.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        <p style={{fontSize: '25px', fontWeight: 'bold', marginBottom: '10px'}}>Amendment to Terms</p>
                        <p style={{fontSize: '23px'}}>Villa Tracker reserves the right to alter these Booking Terms and Conditions from time to time and will notify you of any changes as soon as reasonably possible. The amended Booking Terms and Conditions will apply to any booking which enters into effect after the date of such notification.</p>
                        <p style={{fontSize: '23px'}}>Any handwritten amendments or additions to the Booking Form will only be valid if they are countersigned by Villa Tracker before the booking period.</p>
                    </div>
                    <div className="col-12" style={{margin: '10px 0'}}>
                        
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default TermsConditions;