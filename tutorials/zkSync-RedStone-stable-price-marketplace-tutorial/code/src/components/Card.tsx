interface Props {
  image: string;
  tokenId: string;
  onButtonClick: (tokenId: string) => void;
  buttonText: string;
  price?: string;
  buttonTextColor?: string;
}

export function Card(props: Props) {
  return (
    <div className="card nft-card card-with-shadow increase-on-hover">
      <div className="left">
        <img className="nft-icon" src={props.image} />
        <div className="nft-token-id">NFT #{props.tokenId}</div>
      </div>

      <div className="price">{props.price ? `$${props.price}` : ``}</div>

      <div className="post-sell-order-button-container">
        <a
          className="button"
          href="#"
          style={{ color: props.buttonTextColor }}
          onClick={() => props.onButtonClick(props.tokenId)}
        >
          {props.buttonText}
        </a>
      </div>
    </div>
  );
}
